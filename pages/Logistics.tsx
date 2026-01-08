
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Shipment } from '../types';
import { useInfluencer } from '../context/InfluencerContext';
import NewShipmentModal from '../components/NewShipmentModal';
import ShippingLabelGenerator from '../components/ShippingLabelGenerator';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import TrackingCodeModal from '../components/TrackingCodeModal';
import { TrackingService, TrackingData } from '../services/TrackingService';

import { ShipmentService } from '../services/ShipmentService';
import { LabelGenerator } from '../services/LabelGenerator';

import DeclarationDataModal from '../components/DeclarationDataModal';
import { StatusBadge, StatusOption } from '../components/StatusBadge';



// Status Map for Shipments (Consistent with General.tsx and Sales.tsx)
const SHIPMENT_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  'pending': { label: 'Pendente', color: 'text-yellow-800 dark:text-yellow-300', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  'shipped': { label: 'Enviado', color: 'text-cyan-800 dark:text-cyan-300', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
  'delivered': { label: 'Entregue', color: 'text-green-800 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/30' },
  'cancelled': { label: 'Cancelado', color: 'text-red-800 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/30' }
};

const SHIPMENT_STATUS_OPTIONS: StatusOption[] = Object.entries(SHIPMENT_STATUS_MAP).map(([value, info]) => ({
  value,
  label: info.label,
  color: `${info.bg} ${info.color}`
}));

const ShipmentList = () => {
  const { data } = useInfluencer(); // Hook added to access profile data
  const navigate = useNavigate();
  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isDeclarationModalOpen, setIsDeclarationModalOpen] = useState(false);
  const [pendingShipmentForDeclaration, setPendingShipmentForDeclaration] = useState<Shipment | null>(null);
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

  const handleConfirmDelete = async () => {
    if (selectedShipment) {
      try {
        await ShipmentService.delete(selectedShipment.id);
        setShipments(shipments.filter(s => s.id !== selectedShipment.id));
        setSelectedShipment(null);
        setIsDeleteModalOpen(false); // Close modal explicitly
        alert('Envio excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir envio:', error);
        alert('Erro ao excluir envio. Tente novamente.');
      }
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

  const handleGenerateDocument = async (shipment: Shipment, type: 'label' | 'declaration') => {
    try {
      if (type === 'declaration') {
        // Validar dados críticos
        // Se faltar CPF, endereço completo, etc., abrir modal
        const missingSenderData = !data.profile.cpfCnpj || !data.profile.location;
        const missingRecipientData = !shipment.recipientCpfCnpj || !shipment.recipientAddress || !shipment.recipientCity || !shipment.recipientState || !shipment.recipientCep;

        if (missingSenderData || missingRecipientData) {
          setPendingShipmentForDeclaration(shipment);
          setIsDeclarationModalOpen(true);
          return;
        }
      }

      // Gerar PDF específico
      const { LabelGenerator } = await import('../services/LabelGenerator');
      LabelGenerator.generate(shipment, type, data.profile);

      // Marcar como gerado no backend
      await fetch(`/api/shipments/${shipment.id}/mark-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: type })
      });

      // Update local state optimistic
      const docTypeKey = type === 'label' ? 'labelGenerated' : 'declarationGenerated';
      setShipments(shipments.map(s => s.id === shipment.id ? { ...s, [docTypeKey]: 1 } : s));

      alert(`${type === 'label' ? 'Etiqueta' : 'Declaração'} gerada com sucesso!`);
    } catch (error) {
      console.error('Erro ao gerar documento:', error);
      alert('Erro ao gerar documento');
    }
  };

  const handleSaveDeclarationData = async (updatedData: any) => {
    if (!pendingShipmentForDeclaration) return;

    try {
      // Atualizar o shipment com os dados de destinatário
      // (Opcional: atualizar o profile com dados de remetente se o backend permitir, mas aqui focamos no shipment)
      // Como o LabelGenerator mistura shipment + profile, aqui vamos garantir que o shipment tenha os dados "finais"
      // para essa geração específica.

      // Se quisermos salvar no banco, chamamos a API.
      // Vamos tentar atualizar o shipment no backend para persistir CPFs e outros dados.
      await ShipmentService.update(pendingShipmentForDeclaration.id, {
        recipientName: updatedData.recipientName,
        recipientCpfCnpj: updatedData.recipientCpfCnpj,
        recipientAddress: updatedData.recipientAddress,
        recipientCity: updatedData.recipientCity,
        recipientState: updatedData.recipientState,
        recipientCep: updatedData.recipientCep,
        // Sender data usually comes from profile, but we can override in generate call via specific object if LabelGenerator supported it fully.
        // But LabelGenerator.generate takes (shipment, type, senderProfile).
        // We need to pass a "temporary" profile or modified shipment.
      });

      // Atualizar state local
      const updatedShipment = {
        ...pendingShipmentForDeclaration,
        // Recipient Data (Updated)
        recipientName: updatedData.recipientName,
        recipientCpfCnpj: updatedData.recipientCpfCnpj,
        recipientAddress: updatedData.recipientAddress,
        recipientCity: updatedData.recipientCity,
        recipientState: updatedData.recipientState,
        recipientCep: updatedData.recipientCep,
        // Sender Data (Updated from Modal)
        // We must update these so LabelGenerator uses them directly without needing a profile overlay
        senderName: updatedData.senderName,
        senderCpfCnpj: updatedData.senderCpfCnpj,
        senderAddress: updatedData.senderAddress,
        senderCity: updatedData.senderCity,
        senderState: updatedData.senderState,
        senderCep: updatedData.senderCep
      };

      setShipments(prev => prev.map(s => s.id === updatedShipment.id ? updatedShipment : s));

      // Gerar PDF agora
      const { LabelGenerator } = await import('../services/LabelGenerator');

      // We pass 'undefined' for the profile argument because we have already populated 
      // the shipment object with the "final", user-edited data from the modal.
      // If we passed a profile, LabelGenerator might try to re-parse 'location' 
      // and overwrite our correct City/State with incorrect parsing.
      LabelGenerator.generate(updatedShipment, 'declaration', undefined);

      // Marcar como gerado
      await fetch(`/api/shipments/${updatedShipment.id}/mark-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: 'declaration' })
      });

      setShipments(prev => prev.map(s => s.id === updatedShipment.id ? { ...s, declarationGenerated: 1 } : s));

      setIsDeclarationModalOpen(false);
      setPendingShipmentForDeclaration(null);
      alert('Dados salvos e Declaração gerada com sucesso!');

    } catch (error) {
      console.error("Erro ao salvar dados/gerar declaração:", error);
      alert("Erro ao processar dados. Tente novamente.");
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

      <DeclarationDataModal
        isOpen={isDeclarationModalOpen}
        onClose={() => {
          setIsDeclarationModalOpen(false);
          setPendingShipmentForDeclaration(null);
        }}
        onSave={handleSaveDeclarationData}
        shipment={pendingShipmentForDeclaration}
        senderProfile={data.profile}
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
                        onClick={() => {
                          if (s.trackingCode && !s.trackingCode.startsWith('AG')) {
                            navigator.clipboard.writeText(s.trackingCode);
                            alert('Código copiado para a área de transferência!');
                          }
                        }}
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
                      <StatusBadge
                        status={s.status}
                        options={SHIPMENT_STATUS_OPTIONS}
                        onUpdate={() => { }} // Read-only or implement update logic
                        readOnly={true}
                      />

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
                    <div className="flex justify-end items-center gap-2">
                      {/* Botões de Documentos */}
                      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mr-2">
                        <button
                          onClick={() => handleGenerateDocument(s, 'label')}
                          title={s.labelGenerated ? "Etiqueta Gerada (Baixar Novamente)" : "Gerar Etiqueta"}
                          className={`p-1.5 rounded transition-all flex items-center gap-1 ${s.labelGenerated
                            ? 'bg-white shadow text-green-600 dark:bg-gray-600 dark:text-green-400'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        >
                          <span className="material-symbols-outlined text-[18px]">label</span>
                        </button>

                        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 self-stretch"></div>

                        <button
                          onClick={() => handleGenerateDocument(s, 'declaration')}
                          title={s.declarationGenerated ? "Declaração Gerada (Baixar Novamente)" : "Gerar Declaração"}
                          className={`p-1.5 rounded transition-all flex items-center gap-1 ${s.declarationGenerated
                            ? 'bg-white shadow text-green-600 dark:bg-gray-600 dark:text-green-400'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        >
                          <span className="material-symbols-outlined text-[18px]">description</span>
                        </button>
                      </div>

                      {/* Botão Rastreio - Destaque Principal se pendente */}
                      <button
                        onClick={() => handleTrackingClick(s)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold uppercase tracking-wide
                          ${s.trackingCode && !s.trackingCode.startsWith('AG')
                            ? 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary bg-white'
                            : 'border-primary bg-primary/10 text-primary hover:bg-primary hover:text-white' // Destaque para adicionar
                          }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">barcode_scanner</span>
                        <span>{s.trackingCode && !s.trackingCode.startsWith('AG') ? 'Rastreio' : 'Adicionar Rastreio'}</span>
                      </button>

                      {/* Menu de Acoes Secundarias (Editar/Excluir) */}
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => handleEditClick(s)}
                          title="Editar"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(s)}
                          title="Excluir"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div >
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

      <Route path="/rastreio/:code" element={<TrackingTimeline />} />
    </Routes>
  );
}
