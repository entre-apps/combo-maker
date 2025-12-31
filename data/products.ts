
// FIX: Correctly import all necessary types from the `types` module.
import type { InternetPlan, TvPlan, AppInfo, OmniPlan, NoBreakPlan, Profile, PlanType } from '../types';

interface DbData {
    internet: {
        casa: InternetPlan[];
        empresa: InternetPlan[];
    };
    tv: TvPlan[];
    apps: AppInfo[];
    omni: OmniPlan[];
    nobreak: NoBreakPlan;
}

export const PROFILES: Record<PlanType, Profile[]> = {
    casa: [
        {
            id: 'profile-music',
            name: 'Combo MUSIC',
            description: 'A trilha sonora perfeita para o seu dia com Deezer Premium.',
            icon: 'family',
            config: {
                internetId: 'res-800',
                appIds: ['app-deezer'],
            }
        },
        {
            id: 'profile-gamer',
            name: 'Combo GAMER',
            description: 'Performance máxima com Exit Lag.',
            icon: 'gamer',
            config: {
                internetId: 'res-800',
                appIds: ['app-exitlag'],
            }
        },
        {
            id: 'profile-streaming',
            name: 'Combo STREAMING',
            description: 'O melhor do cinema e séries com HBO Max e Disney inclusos.',
            icon: 'home-office',
            config: {
                internetId: 'res-800',
                appIds: ['app-hbo-noads', 'app-disney-noads'],
            }
        },
    ],
    empresa: [] // Perfis empresariais removidos conforme solicitado
};


// FIX: Replaced outdated product data with the correct, more detailed data structure.
export const DB: DbData = {
    internet: {
        casa: [
            { 
                id: 'res-500', 
                name: '500 Mega', 
                description: 'Sob medida para navegação, redes sociais e vídeo chamadas',
                features: ['Instalação Gratuita¹', 'Wifi 5', 'Upload 100 Mega'],
                price: 99.90, 
                priceDetails: 'R$99,90'
            },
            { 
                id: 'res-600', 
                name: '600 Mega', 
                description: 'Mais velocidade para as atividades do seu dia a dia',
                features: ['Instalação Gratuita¹', 'Wifi 5', 'Upload 150 Mega'],
                price: 112.90, 
                priceDetails: 'R$112,90'
            },
            { 
                id: 'res-800', 
                name: '800 Mega', 
                description: 'Ideal para multiacessos, jogos, trabalho remoto e streaming',
                features: ['Instalação Gratuita¹', 'Wifi 6 (mais estável)', 'Upload 400 Mega'],
                price: 89.90,
                fullPrice: 114.90, 
                priceDetails: 'R$89,90', 
                originalPrice: 'de: R$114,90', 
                promo: '*Nos primeiros 3 meses, após R$114,90', // Texto atualizado
                bestOffer: true, 
                comboDiscount: true 
            },
            { 
                id: 'res-920', 
                name: '920 Mega', 
                description: 'O mais rápido e com 2 pontos OMNI WiFi (maior cobertura)',
                features: ['Instalação Gratuita¹', 'Wifi 6 (mais estável)', 'Upload 500 Mega'],
                price: 169.90, 
                priceDetails: 'R$169,90', 
                comboDiscount: true 
            }
        ],
        empresa: [
             { 
                id: 'emp-800', 
                name: '800 Mega', 
                description: 'Internet rápida e estável para manter sua empresa sempre conectada.',
                features: ['Instalação Gratuita¹', 'Wifi 6 (mais estável)', 'Upload simétrico'],
                price: 139.90, 
                priceDetails: 'R$139,90'
            },
            { 
                id: 'emp-800-gp', 
                name: '800 Mega + Gerência Proativa', 
                description: 'Conectividade inteligente com monitoramento ativo na sua operação.',
                features: ['Instalação Gratuita¹', 'Wifi 6 (mais estável)', 'Upload simétrico', 'Gerência Proativa²', 'IP Fixo³'],
                price: 219.90, 
                priceDetails: 'R$219,90'
            },
            { 
                id: 'emp-800-gp-ip', 
                name: '800 Mega + Gerência Proativa + IP Fixo', 
                description: 'Mais controle, segurança e estabilidade para sistemas e aplicações críticas.',
                features: ['Instalação Gratuita¹', 'Wifi 6 (mais estável)', 'Upload simétrico', 'Gerência Proativa²', 'IP Fixo³'],
                price: 269.90, 
                priceDetails: 'R$269,90'
            },
            { 
                id: 'emp-920-full', 
                name: '920 Mega + Gerência Proativa + IP Fixo', 
                description: 'A solução mais completa para máxima performance e conectividade total.',
                features: ['Instalação Gratuita¹', '2 pontos Wifi 6 (mais estável)', 'Upload simétrico', 'Gerência Proativa²', 'IP Fixo³'],
                price: 319.90, 
                priceDetails: 'R$319,90', 
                bestOffer: true 
            }
        ]
    },
    tv: [
        { id: 'tv-essential', name: 'Essential', details: '15+ canais', price: 15.00, comboPrice: 10.00 },
        { id: 'tv-cine', name: 'Cine & Sports', details: '30+ canais com Paramount+', price: 30.00, comboPrice: 23.00 },
        { id: 'tv-plus', name: 'Plus', details: '50+ canais com Paramount+ e Telecine', price: 60.00, comboPrice: 50.00 },
        { id: 'tv-premium', name: 'Premium', details: '55+ canais com Paramount+, Telecine e Premiere', price: 90.00, comboPrice: 80.00 }
    ],
    apps: [
        { id: 'app-deezer', name: 'Deezer', tier: 'Standard', category: 'Música', details: 'Streaming de música e podcasts com playlists, rádios e recomendações personalizadas.', price: 20, comboPrice: 10 },
        { id: 'app-sky-light', name: 'Sky+ Light', tier: 'Standard', category: 'Sky', details: '13 canais abertos ao vivo.', price: 20, comboPrice: 10 },
        { id: 'app-looke', name: 'Looke', tier: 'Standard', category: 'Séries e Filmes', details: 'Streaming brasileiro com filmes, séries e área infantil (Looke Kids).', price: 20, comboPrice: 10 },
        { id: 'app-kiddle-1', name: 'Kiddle Pass 1 usuário', tier: 'Standard', category: 'Infantil', details: 'Plataforma de experiências educacionais ao vivo e em vídeo para crianças até 12 anos.', price: 20, comboPrice: 10 },
        { id: 'app-nutri', name: '+QNutri', tier: 'Standard', category: 'Saúde e Bem estar', details: 'Aplicativo de acompanhamento nutricional e bem‑estar (curadoria e planos alimentares).', price: 20, comboPrice: 10 },
        { id: 'app-kaspersky-1', name: 'Kaspersky Standard (1 licença)', tier: 'Standard', category: 'Segurança Digital', details: 'Antivírus e proteção essencial com navegação segura e recursos básicos.', price: 20, comboPrice: 10 },
        { id: 'app-exitlag', name: 'Exit Lag', tier: 'Standard', category: 'Games', details: 'Otimizador de rotas para jogos online que reduz lag, perda de pacotes e jitter.', price: 20, comboPrice: 10 },
        { id: 'app-playkids', name: 'PlayKids+', tier: 'Standard', category: 'Infantil', details: 'Plataforma infantil segura com desenhos, jogos educativos e livros digitais.', price: 20, comboPrice: 10 },
        { id: 'app-hubvantagens', name: 'Hub Vantagens', tier: 'Standard', category: 'Descontos', details: 'Clube de benefícios com cupons, descontos em marcas parceiras e cashback.', price: 20, comboPrice: 10 },
        { id: 'app-ubook', name: 'Ubook Plus', tier: 'Standard', category: 'Educação e Leitura', details: 'App de audiolivros, e‑books, podcasts e revistas em um só catálogo.', price: 20, comboPrice: 10 },
        { id: 'app-estuda', name: 'Estuda+', tier: 'Standard', category: 'Educação e Leitura', details: 'App educacional com apostilas em áudio e materiais para reforço e vestibulares.', price: 20, comboPrice: 10 },
        { id: 'app-pequenosleitores', name: 'Pequenos Leitores', tier: 'Standard', category: 'Infantil', details: 'Biblioteca infantil com ebooks e audiobooks selecionados por faixa etária.', price: 20, comboPrice: 10 },
        { id: 'app-fluid', name: 'Fluid', tier: 'Standard', category: 'Saúde e Bem estar', details: 'App de bem‑estar com yoga, meditação guiada, respiração e sons relaxantes.', price: 20, comboPrice: 10 },
        { id: 'app-socialcomics', name: 'Social Comics', tier: 'Standard', category: 'Educação e Leitura', details: 'Streaming de HQs e quadrinhos digitais com catálogo atualizado diariamente.', price: 20, comboPrice: 10 },
        { id: 'app-revistaria', name: 'Revistaria', tier: 'Standard', category: 'Educação e Leitura', details: 'Banca digital com acesso a revistas brasileiras em formato digital/PDF.', price: 20, comboPrice: 10 },
        { id: 'app-playlist', name: 'Playlist', tier: 'Standard', category: 'Música', details: 'A plataforma oferece mais de 100 playlists de diversos gêneros e estilos musicais, todas elaboradas por profissionais do mercado. Os usuários também podem ouvir a rádio streaming, com músicas, notícias e entrevistas 24 horas por dia', price: 20, comboPrice: 10 },
        { id: 'app-sky-light-globo', name: 'Sky+ Light (Globo)', tier: 'Advanced', category: 'Sky', details: '14 canais abertos ao vivo incluindo Globo local.', price: 25, comboPrice: 15 },
        { id: 'app-kiddle-2', name: 'Kiddle Pass 2 usuários', tier: 'Advanced', category: 'Infantil', details: 'Plataforma de atividades educacionais e de lazer para crianças, ao vivo e em vídeo.', price: 25, comboPrice: 15 },
        { id: 'app-kaspersky-3', name: 'Kaspersky Standard (3 licenças)', tier: 'Advanced', category: 'Segurança Digital', details: 'Antivírus e proteção essencial com navegação segura e recursos básicos.', price: 25, comboPrice: 15 },
        { id: 'app-curtaon', name: 'Curta ON', tier: 'Advanced', category: 'Séries e Filmes', details: 'Streaming do Canal Curta! com documentários e séries sobre artes e humanidades.', price: 25, comboPrice: 15 },
        { id: 'app-ojornalista', name: 'O Jornalista', tier: 'Advanced', category: 'Educação e Leitura', details: 'App para ler e ouvir jornais, revistas e podcasts de notícias brasileiros.', price: 25, comboPrice: 15 },
        { id: 'app-sky-light-amazon', name: 'Sky+ Light (Amazon)', tier: 'Top', category: 'Sky', details: '14 canais ao vivo incluindo Globo local e acesso aos benefícios da Amazon: Prime Vídeos, Prime Music e Amazon Prime.', price: 35, comboPrice: 25 },
        { id: 'app-disney-ads', name: 'Disney+ (com anúncio)', tier: 'Top', category: 'Séries e Filmes', details: 'Streaming da Disney com anúncios; catálogo Disney, Pixar, Marvel, Star Wars e NatGeo.', price: 35, comboPrice: 25 },
        { id: 'app-hbo-ads', name: 'HBO Max (com anúncio)', tier: 'Top', category: 'Séries e Filmes', details: 'Todo conteúdo da HBO, Universo DC, Harry Potter e outras histórias imperdíveis, além de esportes ao vivo (com anúncios)', price: 35, comboPrice: 25 },
        { id: 'app-cindie', name: 'C Indie', tier: 'Top', category: 'Séries e Filmes', details: 'Cindie: streaming de cinema e séries independentes, curadoria internacional.', price: 35, comboPrice: 25 },
        { id: 'app-leitura360', name: 'Leitura 360', tier: 'Top', category: 'Educação e Leitura', details: 'Plataforma de leitura multimídia com audiolivros e revistas', price: 35, comboPrice: 25 },
        { id: 'app-disney-noads', name: 'Disney+', tier: 'Premium', category: 'Séries e Filmes', details: 'Streaming da Disney sem anúncios em planos elegíveis; filmes e séries Disney, Pixar, Marvel, Star Wars e NatGeo.', price: 40, comboPrice: 30 },
        { id: 'app-hbo-noads', name: 'HBO Max', tier: 'Premium', category: 'Séries e Filmes', details: 'Todo conteúdo da HBO, Universo DC, Harry Potter e outras histórias imperdíveis, além de esportes ao vivo (sem anúncios)', price: 40, comboPrice: 30 },
        { id: 'app-kaspersky-plus', name: 'Kaspersky Plus (5 licenças)', tier: 'Premium', category: 'Segurança Digital', details: 'Segurança avançada com antivírus e extras como VPN e monitoramento adicional.', price: 40, comboPrice: 30 },
        { id: 'app-smartcontent', name: 'Smart Content', tier: 'Premium', category: 'Educação e Leitura', details: 'App de aprendizado rápido com resumos, videos e áudios curados sobre inovação e negócios.', price: 40, comboPrice: 30 },
        { id: 'app-queimadiaria', name: 'Queima Diária', tier: 'Premium', category: 'Saúde e Bem estar', details: 'App de treinos em casa focado em queima de gordura abdominal e condicionamento.', price: 40, comboPrice: 30 },
        { id: 'app-zen', name: 'Zen', tier: 'Premium', category: 'Saúde e Bem estar', details: 'App de meditação e sono com conteúdos para ansiedade, sono e bem‑estar.', price: 40, comboPrice: 30 },
        { id: 'app-sky-full', name: 'Sky+ Full', tier: 'Sky Full', category: 'Sky', details: '90 canais ao vivo.', price: 89.90, comboPrice: 89.90 }
    ],
    omni: [
        { id: 'omni-cabo', name: 'OMNI CABO', details: 'Ponto adicional cabeado', price: 8.00 },
        { id: 'omni-5', name: 'OMNI WIFI 5', details: 'Ponto adicional Wi-Fi 5', price: 26.00 },
        { id: 'omni-6', name: 'OMNI WIFI 6', details: 'Ponto adicional Wi-Fi 6', price: 32.00 }
    ],
    nobreak: {
        id: 'nobreak', name: 'Mini NoBreak', details: 'Aluguel do equipamento', price: 18.00
    }
};
