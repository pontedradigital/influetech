
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Shipment } from '../types';
import { useInfluencer } from '../context/InfluencerContext';
import NewShipmentModal from '../components/NewShipmentModal';
import ShippingLabelGenerator from '../components/ShippingLabelGenerator';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import TrackingCodeModal from '../components/TrackingCodeModal';
import { TrackingService, TrackingData } from '../services/TrackingService';
import { FreightService, FreightCalculationRequest, FreightCalculationResponse, FreightOption } from '../services/FreightService';
import { ShipmentService } from '../services/ShipmentService';
import { LabelGenerator } from '../services/LabelGenerator';

const ShippingCalculator = () => {
  const { data } = useInfluencer();
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [labelData, setLabelData] = useState<any>(null);
  const [destinationCep, setDestinationCep] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [declaredValue, setDeclaredValue] = useState('');
  const [freightResults, setFreightResults] = useState<FreightCalculationResponse | null>(null);
  const [loadingFreight, setLoadingFreight] = useState(false);

  // Estados para endereço de destino
  const [destinationAddress, setDestinationAddress] = useState({
    street: '',
    city: '',
    state: '',
    neighborhood: ''
  });
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [addressFound, setAddressFound] = useState(false);

  // Novos estados para dados do envio
  const [recipientName, setRecipientName] = useState('');
  const [recipientNumber, setRecipientNumber] = useState('');
  const [contentDescription, setContentDescription] = useState('Produtos Diversos');
  const [savedShipments, setSavedShipments] = useState<Shipment[]>([]);

  // Carregar envios salvos
  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const shipments = await ShipmentService.list();
      setSavedShipments(shipments);
    } catch (error) {
      console.error('Erro ao carregar envios:', error);
    }
  };

  // Função para calcular frete manualmente
  const handleCalculateFreight = async () => {
    // Validar campos obrigatórios
    if (!destinationCep || destinationCep.length !== 9 || !weight || !height || !width || !length) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoadingFreight(true);

    try {
      const request: FreightCalculationRequest = {
        from: {
          postal_code: FreightService.formatCep(data.profile.cep)
        },
        to: {
          postal_code: FreightService.formatCep(destinationCep)
        },
        package: {
          height: parseFloat(height),
          width: parseFloat(width),
          length: parseFloat(length),
          weight: parseFloat(weight)
        },
        options: {
          insurance_value: declaredValue ? parseFloat(declaredValue) : 0
        }
      };

      const results = await FreightService.calculate(request);
      setFreightResults(results);
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      alert('Erro ao calcular frete. Tente novamente.');
      setFreightResults(null);
    } finally {
      setLoadingFreight(false);
    }
  };

  const handleDestinationCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.replace(/^(\d{5})(\d)/, '$1-$2').substr(0, 9);
    setDestinationCep(formatted);

    // Buscar endereço quando CEP estiver completo (8 dígitos)
    if (value.length === 8) {
      setLoadingAddress(true);
      setAddressFound(false);

      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setDestinationAddress({
            street: data.logradouro || '',
            city: data.localidade || '',
            state: data.uf || '',
            neighborhood: data.bairro || ''
          });
          setAddressFound(true);
        } else {
          setDestinationAddress({ street: '', city: '', state: '', neighborhood: '' });
          setAddressFound(false);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setDestinationAddress({ street: '', city: '', state: '', neighborhood: '' });
        setAddressFound(false);
      } finally {
        setLoadingAddress(false);
      }
    } else {
      setDestinationAddress({ street: '', city: '', state: '', neighborhood: '' });
      setAddressFound(false);
    }
  };

  const handleGenerateLabel = async (carrier: string, price: number) => {
    try {
      // 1. Montar objeto de envio
      const shipmentData = {
        senderName: data.profile.name,
        senderAddress: data.profile.location || 'Endereço do Remetente', // TODO: Melhorar isso no perfil
        senderCity: data.profile.location?.split('-')[0]?.trim() || 'Cidade',
        senderState: data.profile.location?.split('-')[1]?.trim() || 'UF',
        senderCep: data.profile.cep,

        recipientName: recipientName || 'Destinatário',
        recipientAddress: `${destinationAddress.street}, ${recipientNumber}`,
        recipientCity: destinationAddress.city,
        recipientState: destinationAddress.state,
        recipientCep: destinationCep,

        weight: parseFloat(weight),
        height: parseFloat(height),
        width: parseFloat(width),
        length: parseFloat(length),
        declaredValue: declaredValue ? parseFloat(declaredValue) : 0,

        carrier,
        price,
        deliveryTime: freightResults && freightResults[carrier] ? freightResults[carrier]!.delivery_time : 0,

        contentDescription,
        contentQuantity: 1
      };

      // 2. Salvar no banco de dados
      const savedShipment = await ShipmentService.create(shipmentData);

      // 3. Gerar PDF
      LabelGenerator.generate(savedShipment);

      alert('Etiqueta gerada e envio salvo com sucesso!');

    } catch (error) {
      console.error('Erro ao gerar etiqueta:', error);
      alert('Erro ao gerar etiqueta. Tente novamente.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ShippingLabelGenerator
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
        data={labelData}
      />
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Calculadora de Frete</h1>
        <p className="text-gray-500">Simule valores e prazos de entrega.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">CEP de Origem</label>
            <input
              type="text"
              value={data.profile.cep}
              disabled
              className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-4 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Configurado em seu perfil</p>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">CEP de Destino</label>
            <div className="relative">
              <input
                type="text"
                value={destinationCep}
                onChange={handleDestinationCepChange}
                placeholder="00000-000"
                maxLength={9}
                className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 focus:ring-2 focus:ring-primary/50"
              />
              {loadingAddress && (
                <span className="absolute right-3 top-3 w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              )}
              {addressFound && !loadingAddress && (
                <svg className="absolute right-3 top-3 w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            {/* Exibir endereço encontrado */}
            {addressFound && destinationAddress.city && (
              <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-900 dark:text-green-100">
                  <strong>{destinationAddress.street || 'Rua não especificada'}</strong>
                  {destinationAddress.neighborhood && `, ${destinationAddress.neighborhood}`}
                  <br />
                  {destinationAddress.city} - {destinationAddress.state}
                </p>
              </div>
            )}
          </div>

          {/* Novos campos de destinatário */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Nome do Destinatário</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Nome completo"
              className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Número / Complemento</label>
            <input
              type="text"
              value={recipientNumber}
              onChange={(e) => setRecipientNumber(e.target.value)}
              placeholder="Ex: 123, Apto 45"
              className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Descrição do Conteúdo</label>
            <input
              type="text"
              value={contentDescription}
              onChange={(e) => setContentDescription(e.target.value)}
              placeholder="Ex: Roupas, Eletrônicos..."
              className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="col-span-1 relative">
            <label className="block text-sm font-medium mb-2">Peso (kg)</label>
            <select
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="">Selecione o peso</option>
              {/* De 100 em 100 gramas até 1kg */}
              <option value="0.1">100g (0,1 kg)</option>
              <option value="0.2">200g (0,2 kg)</option>
              <option value="0.3">300g (0,3 kg)</option>
              <option value="0.4">400g (0,4 kg)</option>
              <option value="0.5">500g (0,5 kg)</option>
              <option value="0.6">600g (0,6 kg)</option>
              <option value="0.7">700g (0,7 kg)</option>
              <option value="0.8">800g (0,8 kg)</option>
              <option value="0.9">900g (0,9 kg)</option>
              <option value="1">1 kg</option>
              {/* De 1 em 1 kg até 20kg */}
              {Array.from({ length: 19 }, (_, i) => i + 2).map(kg => (
                <option key={kg} value={kg}>{kg} kg</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Dimensões (cm)</label>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Altura"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="number"
                placeholder="Largura"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="number"
                placeholder="Comprimento"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="col-span-1 relative">
            <label className="block text-sm font-medium mb-2">Valor Declarado (opcional)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={declaredValue}
              onChange={(e) => setDeclaredValue(e.target.value)}
              className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent pl-10 px-4 focus:ring-2 focus:ring-primary/50"
            />
            <span className="absolute left-4 top-[38px] text-gray-500">R$</span>
          </div>
        </div>

        {/* Botão Gerar Cálculo */}
        <div className="flex justify-end">
          <button
            onClick={handleCalculateFreight}
            disabled={loadingFreight}
            className="flex items-center gap-2 bg-primary hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            {loadingFreight ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Calculando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">calculate</span>
                Gerar Cálculo
              </>
            )}
          </button>
        </div>
      </div>

      {/* Aviso sobre cálculos estimados */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Cálculos Estimados:</strong> Os valores exibidos são estimativas baseadas na API do Melhor Envio.
              Para obter valores exatos e descontos de até 80%, recomendamos criar uma conta gratuita em{' '}
              <a
                href="https://melhorenvio.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                melhorenvio.com.br
              </a>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Resultados</h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          {freightResults && Object.keys(freightResults).length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Renderizar todas as transportadoras disponíveis */}
              {Object.entries(freightResults).map(([key, opt]) => {
                const option = opt as FreightOption;
                if (!option) return null;

                // Definir cores por transportadora
                const carrierColors: Record<string, { bg: string, text: string }> = {
                  'Correios': { bg: 'bg-blue-100', text: 'text-blue-800' },
                  'Jadlog': { bg: 'bg-green-100', text: 'text-green-800' },
                  'Loggi': { bg: 'bg-purple-100', text: 'text-purple-800' },
                  'Azul Cargo': { bg: 'bg-sky-100', text: 'text-sky-800' }
                };

                const colors = carrierColors[option.company.name] || { bg: 'bg-gray-100', text: 'text-gray-800' };

                return (
                  <div key={key} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between gap-6 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg">{option.name}</h4>
                          <span className={`text-xs ${colors.bg} ${colors.text} px-2 py-0.5 rounded font-medium`}>
                            {option.company.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Prazo: {option.delivery_time} dia{option.delivery_time > 1 ? 's' : ''} útei{option.delivery_time > 1 ? 's' : ''} <span className="text-gray-400">(estimado)</span>
                        </p>
                        {option.delivery_range && (
                          <p className="text-xs text-gray-400 mt-1">
                            Entrega entre {option.delivery_range.min} e {option.delivery_range.max} dias
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                          {option.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {loadingFreight ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p>Calculando frete...</p>
                </div>
              ) : (
                <p>Preencha todos os campos para calcular o frete.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div >
  );
};



const ShipmentList = () => {
  const navigate = useNavigate();
  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const data = await ShipmentService.list();
      setShipments(data);
    } catch (error) {
      console.error('Erro ao carregar envios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data mapping for editing (in a real app this would come from the shipment object)
  const getShipmentDetails = (shipment: Shipment) => ({
    buyerName: shipment.recipientName,
    buyerCpf: shipment.recipientCpfCnpj || '',
    cep: shipment.recipientCep,
    street: shipment.recipientAddress,
    number: '', // TODO: Split address
    complement: '',
    neighborhood: shipment.recipientCity, // Fallback
    city: shipment.recipientCity,
    state: shipment.recipientState,
    productName: shipment.contentDescription || '',
    value: shipment.declaredValue?.toString() || '',
    paymentMethod: 'Pix'
  });

  const handleSaveShipment = (data: any) => {
    if (selectedShipment) {
      // Edit mode
      // TODO: Implement update via API
      console.log('Update not implemented yet');
    } else {
      // Create mode
      // TODO: Implement create via API
      console.log('Create not implemented yet');
    }
    setIsNewShipmentModalOpen(false);
    setSelectedShipment(null);
  };

  const handleEditClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsNewShipmentModalOpen(true);
  };

  const handleDeleteClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedShipment) {
      setShipments(shipments.filter(s => s.id !== selectedShipment.id));
      setSelectedShipment(null);
    }
  };

  const handleTrackingClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsTrackingModalOpen(true);
  };

  const handleSaveTracking = (code: string) => {
    if (selectedShipment) {
      setShipments(shipments.map(s => s.id === selectedShipment.id ? { ...s, trackingCode: code } : s));
      setSelectedShipment(null);
    }
  };

  const handleGenerateDocuments = async (shipment: Shipment) => {
    try {
      // Gerar PDF (etiqueta + declaração)
      const { LabelGenerator } = await import('../services/LabelGenerator');
      LabelGenerator.generate(shipment);

      // Marcar ambos como gerados no backend
      await fetch(`/api/shipments/${shipment.id}/mark-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: 'both' })
      });

      // Recarregar lista
      loadShipments();

      alert('Documentos gerados com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar documentos:', error);
      alert('Erro ao gerar documentos');
    }
  };

  const handleMarkAsShipped = async (shipment: Shipment) => {
    // Validar se documentos foram gerados
    if (!shipment.labelGenerated || !shipment.declarationGenerated) {
      alert('Você precisa gerar a Etiqueta e a Declaração de Conteúdo antes de marcar como enviado!');
      return;
    }

    // Validar dados obrigatórios
    if (!shipment.recipientName || !shipment.recipientCep || !shipment.recipientAddress) {
      alert('Dados do destinatário incompletos! Complete os dados antes de enviar.');
      return;
    }

    try {
      const response = await fetch(`/api/shipments/${shipment.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'shipped' })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao atualizar status');
        return;
      }

      loadShipments();
      alert('Envio marcado como enviado!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar status');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Lista de Envios</h1>
          <p className="text-gray-500">Gerencie e rastreie seus envios.</p>
        </div>
        <div className="flex gap-2">
          <Link to="calculadora" className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined">calculate</span> Calculadora
          </Link>
          <button
            onClick={() => {
              setSelectedShipment(null);
              setIsNewShipmentModalOpen(true);
            }}
            className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            <span className="material-symbols-outlined">add</span> Novo Envio
          </button>
        </div>
      </div>

      <NewShipmentModal
        isOpen={isNewShipmentModalOpen}
        onClose={() => {
          setIsNewShipmentModalOpen(false);
          setSelectedShipment(null);
        }}
        onSave={handleSaveShipment}
        initialData={selectedShipment ? getShipmentDetails(selectedShipment) : undefined}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedShipment(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Excluir Envio"
        message={`Tem certeza que deseja excluir o envio de "${selectedShipment?.contentDescription}" para ${selectedShipment?.recipientName}? Esta ação não pode ser desfeita.`}
      />

      <TrackingCodeModal
        isOpen={isTrackingModalOpen}
        onClose={() => {
          setIsTrackingModalOpen(false);
          setSelectedShipment(null);
        }}
        onSave={handleSaveTracking}
        currentCode={selectedShipment?.trackingCode}
      />

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input type="text" placeholder="Buscar rastreio..." className="w-full pl-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-900 border-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Conteúdo</th>
                <th className="px-6 py-4">Destinatário</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {shipments.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${s.trackingCode && !s.trackingCode.startsWith('AG') ? 'text-primary hover:underline cursor-pointer' : 'text-gray-500'}`}
                        onClick={() => s.trackingCode && !s.trackingCode.startsWith('AG') && navigate(`rastreio/${s.trackingCode}`)}
                      >
                        {s.trackingCode || 'Sem código'}
                      </span>
                      {s.trackingCode?.startsWith('AG') && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                          Pendente
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{s.contentDescription}</td>
                  <td className="px-6 py-4 text-gray-500">{s.recipientName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Status do envio */}
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                        ${s.status === 'shipped' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          s.status === 'delivered' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                        {s.status === 'shipped' ? 'Enviado' : s.status === 'delivered' ? 'Entregue' : 'Pendente'}
                      </span>

                      {/* Indicadores de documentos */}
                      <div className="flex gap-1">
                        {s.labelGenerated ? (
                          <span className="text-green-600 dark:text-green-400" title="Etiqueta gerada">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                          </span>
                        ) : (
                          <span className="text-gray-400" title="Etiqueta não gerada">
                            <span className="material-symbols-outlined text-sm">cancel</span>
                          </span>
                        )}

                        {s.declarationGenerated ? (
                          <span className="text-green-600 dark:text-green-400" title="Declaração gerada">
                            <span className="material-symbols-outlined text-sm">description</span>
                          </span>
                        ) : (
                          <span className="text-gray-400" title="Declaração não gerada">
                            <span className="material-symbols-outlined text-sm">description</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      {/* Botão Gerar Documentos */}
                      {(!s.labelGenerated || !s.declarationGenerated) && (
                        <button
                          onClick={() => handleGenerateDocuments(s)}
                          title="Gerar Etiqueta e Declaração"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">print</span>
                        </button>
                      )}

                      {/* Botão Marcar como Enviado */}
                      {s.labelGenerated && s.declarationGenerated && s.status === 'pending' && (
                        <button
                          onClick={() => handleMarkAsShipped(s)}
                          title="Marcar como Enviado"
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleTrackingClick(s)}
                        title="Adicionar/Editar Rastreio"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">barcode_scanner</span>
                      </button>
                      <button
                        onClick={() => handleEditClick(s)}
                        title="Editar Envio"
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(s)}
                        title="Excluir Envio"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};





const TrackingTimeline = () => {
  const { code } = useParams();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (code) {
      setLoading(true);
      TrackingService.track(code)
        .then(data => {
          setTrackingData(data);
          setError('');
        })
        .catch(err => {
          setError('Não foi possível carregar o rastreio. Verifique o código.');
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [code]);

  if (loading) return <div className="p-8 text-center">Carregando rastreio...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!trackingData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex gap-2 text-sm text-gray-500 mb-4">
        <Link to="/envios" className="hover:text-primary">Envios</Link> / <span>Timeline</span>
      </div>

      <h1 className="text-3xl font-black text-gray-900 dark:text-white">Timeline de Rastreio</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex gap-6 items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-500">Status atual</p>
              <p className="text-lg font-bold text-green-600 flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined">local_shipping</span> {trackingData.eventos[0]?.status || 'Sem status'}
              </p>
              <p className="text-sm text-gray-400 mt-1">{trackingData.eventos[0]?.data} às {trackingData.eventos[0]?.hora}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold mb-6">Eventos</h3>
            <div className="space-y-8 pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-4 relative">
              {trackingData.eventos.map((evento, index) => (
                <div key={index} className="relative">
                  <div className={`absolute -left-[25px] top-0 w-5 h-5 rounded-full ring-4 ring-white dark:ring-gray-800 ${index === 0 ? 'bg-primary' : 'bg-gray-400'}`}></div>
                  <div className={`${index === 0 ? 'bg-primary/5 border border-primary/20' : ''} p-4 rounded-lg`}>
                    <p className="font-bold text-gray-900 dark:text-white">{evento.status}</p>
                    <p className="text-sm text-gray-500">{evento.local}</p>
                    {evento.subStatus && evento.subStatus.map((sub, i) => (
                      <p key={i} className="text-sm text-gray-500">{sub}</p>
                    ))}
                    <p className="text-xs text-gray-400 mt-1">{evento.data} - {evento.hora}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold mb-4">Detalhes</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Código</p>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-gray-900 dark:text-white">{trackingData.codigo}</span>
                  <button className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-sm">content_copy</span></button>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Serviço</p>
                <p className="text-gray-900 dark:text-white">{trackingData.servico || 'Correios'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Logistics() {
  return (
    <Routes>
      <Route path="/" element={<ShipmentList />} />
      <Route path="/calculadora" element={<ShippingCalculator />} />
      <Route path="/rastreio/:code" element={<TrackingTimeline />} />
    </Routes>
  );
}
