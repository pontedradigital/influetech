
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Shipment } from '../types';

const ShippingCalculator = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Calculadora de Frete</h1>
        <p className="text-gray-500">Simule valores e prazos de entrega.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">CEP de Destino</label>
            <input type="text" placeholder="00000-000" className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4" />
          </div>
          <div className="col-span-1 relative">
            <label className="block text-sm font-medium mb-2">Peso (kg)</label>
            <input type="text" placeholder="0,0" className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4" />
            <span className="absolute right-4 top-[38px] text-gray-500">kg</span>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Dimensões (cm)</label>
            <div className="grid grid-cols-3 gap-4">
              <input type="text" placeholder="Altura" className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4" />
              <input type="text" placeholder="Largura" className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4" />
              <input type="text" placeholder="Comprimento" className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4" />
            </div>
          </div>
          <div className="col-span-1 relative">
            <label className="block text-sm font-medium mb-2">Valor Declarado</label>
            <input type="text" placeholder="0,00" className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent pl-10 px-4" />
            <span className="absolute left-4 top-[38px] text-gray-500">R$</span>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-600">Calcular</button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Resultados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-gray-700 dark:text-gray-300">PAC</h4>
              <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">R$ 25,90</p>
              <p className="text-gray-500 mt-1">Prazo: 5 dias úteis</p>
            </div>
            <button className="w-full mt-6 py-2.5 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20">Gerar Etiqueta</button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-gray-700 dark:text-gray-300">SEDEX</h4>
              <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">R$ 48,50</p>
              <p className="text-gray-500 mt-1">Prazo: 2 dias úteis</p>
            </div>
            <button className="w-full mt-6 py-2.5 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20">Gerar Etiqueta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShipmentList = () => {
  const navigate = useNavigate();
  const shipments: Shipment[] = [
    { id: '1', trackingCode: 'BR123456789BR', productName: 'Teclado Mecânico', buyer: 'Ana Silva', date: '15/07/2024', status: 'Entregue' },
    { id: '2', trackingCode: 'BR987654321BR', productName: 'Mouse Óptico', buyer: 'Carlos Souza', date: '14/07/2024', status: 'Em trânsito' },
    { id: '3', trackingCode: 'BR564738291BR', productName: 'Headset Gamer', buyer: 'Juliana Pereira', date: '12/07/2024', status: 'Enviado' },
  ];

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
           <button className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-bold">
             <span className="material-symbols-outlined">add</span> Novo Envio
           </button>
        </div>
      </div>

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
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Comprador</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {shipments.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => navigate(`rastreio/${s.trackingCode}`)}>
                  <td className="px-6 py-4 text-primary font-medium hover:underline">{s.trackingCode}</td>
                  <td className="px-6 py-4 font-medium">{s.productName}</td>
                  <td className="px-6 py-4 text-gray-500">{s.buyer}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                      ${s.status === 'Entregue' ? 'bg-green-100 text-green-800' :
                        s.status === 'Em trânsito' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-primary"><span className="material-symbols-outlined">visibility</span></button>
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
                <span className="material-symbols-outlined">local_shipping</span> Objeto em trânsito
              </p>
              <p className="text-sm text-gray-400 mt-1">15/08/2024 às 14:30</p>
            </div>
            <div className="w-32 h-20 bg-gray-200 rounded-lg"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold mb-6">Eventos</h3>
            <div className="space-y-8 pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-4 relative">
              <div className="relative">
                <div className="absolute -left-[25px] top-0 w-5 h-5 bg-primary rounded-full ring-4 ring-white dark:ring-gray-800"></div>
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <p className="font-bold text-gray-900 dark:text-white">Objeto em trânsito - de CTE para CEE</p>
                  <p className="text-sm text-gray-500">São Paulo, SP</p>
                  <p className="text-xs text-gray-400 mt-1">15/08/2024 - 14:30</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-3 h-3 bg-gray-400 rounded-full ring-4 ring-white dark:ring-gray-800"></div>
                <div className="p-4 pt-0">
                  <p className="font-medium text-gray-700 dark:text-gray-300">Objeto postado</p>
                  <p className="text-sm text-gray-500">Agência Correios, Rio de Janeiro</p>
                  <p className="text-xs text-gray-400 mt-1">13/08/2024 - 16:45</p>
                </div>
              </div>
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
                  <span className="font-mono text-gray-900 dark:text-white">PM123456789BR</span>
                  <button className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-sm">content_copy</span></button>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Destinatário</p>
                <p className="text-gray-900 dark:text-white">Maria Silva</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Endereço</p>
                <p className="text-gray-900 dark:text-white">Rua das Flores, 123, SP</p>
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
