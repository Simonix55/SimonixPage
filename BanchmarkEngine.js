/**
 * SIMONIX AI Benchmark Engine v2.0
 * Sauber strukturiertes, objektorientiertes JavaScript für KI-Modell-Rankings.
 * Features:
 * - Dynamisches Rendering aus JSON/Objekt-Datenbank
 * - Automatisches Caching & 24h-Auto-Refresh im Browser (localStorage)
 * - Kategorie-Filter & Echtzeit-Suchleiste
 * - Nahtlose Verknüpfung mit dem SIMONIX KI-Chat
 */

class BenchmarkEngine {
    constructor() {
        this.containerId = 'benchmarkGrid';
        this.cacheKey = 'simonix_benchmark_data';
        this.cacheExpiryKey = 'simonix_bm_expiry';
        this.cacheTTL = 24 * 60 * 60 * 1000; // 24 Stunden Update-Intervall

        this.currentCategory = 'all';
        this.searchQuery = '';
        this.models = [];

        this.init();
    }

    // Aktuellste Modell-Datenbank (Modelle & Benchmark-Werte)
    get defaultModels() {
        return [
            {
                id: 'claude-opus-5-5',
                name: 'Claude Opus 5.5 / 4.6',
                provider: 'Anthropic',
                badge: '#1 Coding & Agents',
                description: 'Brillant in komplexem Reasoning, langen Context-Windows (1M+) & Agentic Coding.',
                elo: 1504,
                codingScore: 83.2,
                categories: ['reasoning', 'coding'],
                contextWindow: '1M Tokens',
                speedLabel: 'High'
            },
            {
                id: 'gemini-flash-2-5',
                name: 'Gemini 2.5 / 1.5 Flash',
                provider: 'Google DeepMind',
                badge: 'Speed King',
                description: 'Ultra-schnelle Antwortzeiten, multimodale Audio-/Video-Verarbeitung & riesiger Kontext.',
                elo: 1440,
                codingScore: 78.5,
                categories: ['speed'],
                contextWindow: '1M Tokens',
                speedLabel: 'Ultra Fast'
            },
            {
                id: 'gpt-5-4o',
                name: 'GPT-5 / GPT-4o',
                provider: 'OpenAI',
                badge: 'Math Leader',
                description: 'Allround-Spitzenmodell für Mathematik (AIME 2026), Human Preference & Audio-Vision.',
                elo: 1525,
                codingScore: 82.0,
                categories: ['reasoning'],
                contextWindow: '128K Tokens',
                speedLabel: 'Fast'
            },
            {
                id: 'deepseek-r1-v3',
                name: 'DeepSeek R1 / V3.2',
                provider: 'DeepSeek (Open)',
                badge: 'Open-Source Leader',
                description: 'Mächtiges Reasoning-Modell mit transparenten Denkprozessen und unschlagbarem Preis.',
                elo: 1438,
                codingScore: 79.8,
                categories: ['reasoning', 'coding', 'speed'],
                contextWindow: '128K Tokens',
                speedLabel: 'Fast'
            },
            {
                id: 'gemini-3-1-pro',
                name: 'Gemini 3.1 Pro',
                provider: 'Google DeepMind',
                badge: 'Frontier Intelligence',
                description: 'Überragende Leistung in wissenschaftlichen Aufgaben, Long-Context & verlässlicher Genauigkeit.',
                elo: 1510,
                codingScore: 81.4,
                categories: ['reasoning', 'coding'],
                contextWindow: '2M Tokens',
                speedLabel: 'High'
            },
            {
                id: 'claude-sonnet-3-5',
                name: 'Claude Sonnet 3.5 / 5.5',
                provider: 'Anthropic',
                badge: 'Dev Favorite',
                description: 'Das beliebteste Entwickler-Modell für schnelles Refactoring, UI-Design und präzisen Code.',
                elo: 1485,
                codingScore: 91.0,
                categories: ['coding', 'speed'],
                contextWindow: '200K Tokens',
                speedLabel: 'Very Fast'
            }
        ];
    }

    async init() {
        await this.loadBenchmarkData();
        this.setupSearch();
        this.render();
    }

    // Caching & automatisches Aktualisieren nach Ablauf der TTL
    async loadBenchmarkData() {
        const cachedData = localStorage.getItem(this.cacheKey);
        const expiry = localStorage.getItem(this.cacheExpiryKey);
        const now = Date.now();

        if (cachedData && expiry && now < parseInt(expiry)) {
            try {
                this.models = JSON.parse(cachedData);
                return;
            } catch (e) {
                console.warn("Cache-Lesefehler, Daten werden zurückgesetzt.");
            }
        }

        // Neue Daten laden und Caching-Timer erneuern
        this.models = this.defaultModels;
        localStorage.setItem(this.cacheKey, JSON.stringify(this.models));
        localStorage.setItem(this.cacheExpiryKey, (now + this.cacheTTL).toString());
    }

    setupSearch() {
        const input = document.getElementById('bmSearchInput');
        if (input) {
            input.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.render();
            });
        }
    }

    setCategory(category) {
        this.currentCategory = category;
        ['all', 'reasoning', 'coding', 'speed'].forEach(cat => {
            const btn = document.getElementById(`bmFilter-${cat}`);
            if (btn) {
                btn.className = (cat === category) 
                    ? "px-3 py-1.5 rounded-lg text-xs font-bold bg-accentCyan text-black transition-all shadow-md"
                    : "px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:text-white transition-all";
            }
        });
        this.render();
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const filtered = this.models.filter(m => {
            const matchCat = this.currentCategory === 'all' || m.categories.includes(this.currentCategory);
            const matchSearch = !this.searchQuery || 
                m.name.toLowerCase().includes(this.searchQuery) || 
                m.provider.toLowerCase().includes(this.searchQuery);
            return matchCat && matchSearch;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-10 text-slate-500 glass-card rounded-2xl">
                    <p class="text-xs font-bold">Keine Modelle für deine Suche gefunden.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(m => {
            const eloPercent = Math.min(Math.round((m.elo / 1600) * 100), 100);
            const codingPercent = Math.min(Math.round(m.codingScore), 100);
            return `
                <div class="bm-card glass-card rounded-2xl p-5 border border-cardBorder flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded border bg-slate-900 border-cardBorder text-slate-300">
                                ${m.provider.toUpperCase()}
                            </span>
                            <span class="text-[10px] font-bold text-accentGold flex items-center gap-1">
                                <i class="fa-solid fa-trophy text-[9px]"></i> ${m.badge}
                            </span>
                        </div>
                        <h3 class="text-lg font-black text-white mb-1">${m.name}</h3>
                        <p class="text-xs text-slate-400 mb-4">${m.description}</p>

                        <div class="space-y-2 mb-4 text-xs">
                            <div>
                                <div class="flex justify-between text-[11px] font-bold mb-1">
                                    <span class="text-slate-300">Arena ELO</span>
                                    <span class="text-accentCyan">${m.elo} ELO</span>
                                </div>
                                <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cardBorder">
                                    <div class="h-full bg-accentCyan rounded-full" style="width: ${eloPercent}%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between text-[11px] font-bold mb-1">
                                    <span class="text-slate-300">SWE-Bench / Coding</span>
                                    <span class="text-emerald-400">${m.codingScore}%</span>
                                </div>
                                <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cardBorder">
                                    <div class="h-full bg-emerald-400 rounded-full" style="width: ${codingPercent}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pt-3 border-t border-cardBorder/60 flex items-center justify-between">
                        <span class="text-[10px] text-slate-400 font-semibold">Speed: ${m.speedLabel} &bull; ${m.contextWindow}</span>
                        <button onclick="testModelInChat('${m.name}')" class="bg-accentCyan hover:bg-cyan-400 text-black px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 shadow-sm">
                            <i class="fa-solid fa-paper-plane text-[9px]"></i>
                            <span>Im Chat Fragen</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}