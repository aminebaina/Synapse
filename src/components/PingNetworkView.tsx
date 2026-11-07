import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Send, 
  Laptop, 
  Server, 
  Globe, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Info,
  Radio,
  Terminal,
  ShieldAlert
} from 'lucide-react';

interface PingLog {
  id: number;
  text: string;
  isSuccess: boolean;
  timeMs?: number;
}

export default function PingNetworkView() {
  const [isCableCut, setIsCableCut] = useState<boolean>(false);
  const [networkType, setNetworkType] = useState<'fibre' | '4g' | 'satellite'>('fibre');
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [packetProgress, setPacketProgress] = useState<number>(0); // 0 -> 100
  const [packetDirection, setPacketDirection] = useState<'request' | 'reply'>('request');
  const [logs, setLogs] = useState<PingLog[]>([
    { id: 1, text: 'Prêt à tester la connectivité réseau.', isSuccess: true }
  ]);
  const [stats, setStats] = useState({ sent: 0, received: 0, lost: 0 });

  const getLatency = () => {
    switch (networkType) {
      case 'fibre': return Math.floor(Math.random() * 8) + 12; // 12-20ms
      case '4g': return Math.floor(Math.random() * 20) + 45; // 45-65ms
      case 'satellite': return Math.floor(Math.random() * 80) + 550; // 550-630ms
    }
  };

  const handleSendPing = () => {
    if (isPinging) return;
    setIsPinging(true);
    setPacketProgress(0);
    setPacketDirection('request');

    setStats((s) => ({ ...s, sent: s.sent + 1 }));

    // Animation frames
    const stepDuration = networkType === 'satellite' ? 40 : 20;
    let progress = 0;

    const interval = setInterval(() => {
      progress += 4;
      setPacketProgress(progress);

      // Packet reaches server, return reply
      if (progress >= 50 && isCableCut) {
        clearInterval(interval);
        setIsPinging(false);
        setStats((s) => ({ ...s, lost: s.lost + 1 }));
        setLogs((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: 'Délai d’attente de la demande dépassé (Request timed out). Câble coupé ou serveur injoignable.',
            isSuccess: false,
          },
        ]);
        return;
      }

      if (progress >= 50 && progress < 54) {
        setPacketDirection('reply');
      }

      if (progress >= 100) {
        clearInterval(interval);
        setIsPinging(false);
        const rtt = getLatency();
        setStats((s) => ({ ...s, received: s.received + 1 }));
        setLogs((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: `Réponse de 8.8.8.8 : octets=64 temps=${rtt}ms TTL=117 (Succès ICMP Echo Reply)`,
            isSuccess: true,
            timeMs: rtt,
          },
        ]);
      }
    }, stepDuration);
  };

  const handleClearLogs = () => {
    setLogs([{ id: Date.now(), text: 'Historique effacé.', isSuccess: true }]);
    setStats({ sent: 0, received: 0, lost: 0 });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Wifi className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Le Ping Réseau & Client-Serveur
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          L'outil réseau le plus simple au monde : envoyer un signal d'écho pour savoir si une machine distante est en ligne et mesurer le temps d'aller-retour (la latence).
        </p>
      </section>

      {/* Main Interactive Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        {/* Network Diagram */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            
            {/* Machine 1 : Client */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-sky-300 shadow-lg shadow-sky-500/10">
                <Laptop className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-white mt-2">Mon Ordinateur</span>
              <span className="text-[10px] font-mono text-slate-400">192.168.1.15</span>
              <span className="text-[10px] font-mono text-sky-400 mt-0.5">Client (Émetteur)</span>
            </div>

            {/* Connecting Wire */}
            <div className="flex-1 mx-6 relative">
              {/* Cable line */}
              <div
                className={`h-1.5 w-full rounded-full transition-colors ${
                  isCableCut ? 'bg-red-500/40 border border-dashed border-red-500' : 'bg-slate-800'
                }`}
              />

              {/* Cable Cut indicator */}
              {isCableCut && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/20 border border-red-500 text-red-300 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 whitespace-nowrap">
                  <ShieldAlert className="w-3 h-3" />
                  <span>CÂBLE COUPÉ</span>
                </div>
              )}

              {/* Traveling Packet */}
              {isPinging && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 flex flex-col items-center"
                  style={{
                    left: packetDirection === 'request' 
                      ? `${packetProgress * 2}%` 
                      : `${100 - (packetProgress - 50) * 2}%`,
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white shadow-lg shadow-amber-400/50 flex items-center justify-center animate-pulse">
                    <Radio className="w-3 h-3 text-slate-950" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-amber-300 whitespace-nowrap mt-1">
                    {packetDirection === 'request' ? 'ICMP Echo Request →' : '← ICMP Echo Reply'}
                  </span>
                </div>
              )}
            </div>

            {/* Machine 2 : Server */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/10">
                <Server className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-white mt-2">Serveur Distant</span>
              <span className="text-[10px] font-mono text-slate-400">8.8.8.8 (Google)</span>
              <span className="text-[10px] font-mono text-emerald-400 mt-0.5">Serveur (Répondeur)</span>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSendPing}
              disabled={isPinging}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isPinging
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPinging ? 'Ping en cours...' : 'Envoyer un Ping (ping 8.8.8.8)'}</span>
            </button>

            {/* Cable toggle */}
            <button
              onClick={() => setIsCableCut(!isCableCut)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isCableCut
                  ? 'bg-red-500/20 border-red-500 text-red-300 hover:bg-red-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isCableCut ? 'Réparer le câble' : 'Simuler câble coupé'}
            </button>
          </div>

          {/* Network type selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 px-2 text-[11px]">Type de ligne :</span>
            {(['fibre', '4g', 'satellite'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setNetworkType(type)}
                className={`px-2.5 py-1 rounded-lg capitalize font-mono transition-colors cursor-pointer ${
                  networkType === type ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Log Console */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>Sortie Console (Terminal)</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>Envoyés : <strong className="text-white">{stats.sent}</strong></span>
              <span>Reçus : <strong className="text-emerald-400">{stats.received}</strong></span>
              <span>Perdus : <strong className="text-red-400">{stats.lost}</strong></span>
              <button
                onClick={handleClearLogs}
                className="text-slate-500 hover:text-slate-300 ml-2"
              >
                Effacer
              </button>
            </div>
          </div>

          <div className="space-y-1 max-h-36 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`flex items-center gap-2 ${
                  log.isSuccess ? 'text-slate-300' : 'text-red-400'
                }`}
              >
                {log.isSuccess ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-400 shrink-0" />
                )}
                <span>{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pedagogical Explanation Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>L’analogie de l’écho en montagne</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Vous criez « <em>Hé !</em> » en face d'une falaise. Le temps qu'il faut à votre voix pour faire l'aller-retour jusqu'à vos oreilles correspond exactement à la <strong>latence (RTT)</strong>. Si vous n'entendez rien en retour, c'est qu'il y a un obstacle (perte de paquet).
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400" />
            <span>Pourquoi est-ce si simple ?</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Le protocole <strong>ICMP Echo</strong> est le protocole le plus élémentaire du web : il ne transmet aucun fichier complexe, aucun mot de passe. C'est simplement un battement de cœur numérique : <em>« Es-tu là ? — Oui, je suis là ! »</em>.
          </p>
        </div>
      </div>
    </div>
  );
}
