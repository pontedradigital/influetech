
type LanguageCode = 'pt' | 'en' | 'es' | 'zh';

const DICTIONARY: Record<string, Record<LanguageCode, string>> = {
    // Headers & Titles
    'Media Kit': { pt: 'Media Kit', en: 'Media Kit', es: 'Media Kit', zh: '媒体资料包' },
    'Sobre Mim': { pt: 'Sobre Mim', en: 'About Me', es: 'Sobre Mí', zh: '关于我' },
    'Métricas de Alcance': { pt: 'Métricas de Alcance', en: 'Reach Metrics', es: 'Métricas de Alcance', zh: '影响力指标' },
    'Tipos de Conteúdo': { pt: 'Tipos de Conteúdo', en: 'Content Types', es: 'Tipos de Contenido', zh: '内容类型' },
    'Oportunidades de Parceria': { pt: 'Oportunidades de Parceria', en: 'Partnership Opportunities', es: 'Oportunidades de Asociación', zh: '合作机会' },
    'Categorias de Interesse': { pt: 'Categorias de Interesse', en: 'Categories of Interest', es: 'Categorías de Interés', zh: '感兴趣的类别' },
    'Por Que Fazer Parceria Comigo?': { pt: 'Por Que Fazer Parceria Comigo?', en: 'Why Partner With Me?', es: '¿Por Qué Asociarse Conmigo?', zh: '为什么与我合作？' },
    'Vamos Conversar?': { pt: 'Vamos Conversar?', en: "Let's Connect?", es: '¿Hablamos?', zh: '让我们联系？' },
    'Contato': { pt: 'Contato', en: 'Contact', es: 'Contacto', zh: '联系方式' },
    'Educação': { pt: 'Educação', en: 'Education', es: 'Educación', zh: '教育' },
    'Experiência': { pt: 'Experiência', en: 'Experience', es: 'Experiencia', zh: '经验' },
    'Habilidades': { pt: 'Habilidades', en: 'Skills', es: 'Habilidades', zh: '技能' },
    'Interesses': { pt: 'Interesses', en: 'Interests', es: 'Intereses', zh: '兴趣' },
    'Portfólio': { pt: 'Portfólio', en: 'Portfolio', es: 'Portafolio', zh: '作品集' },

    // Metrics
    'Total de Seguidores': { pt: 'Total de Seguidores', en: 'Total Followers', es: 'Total de Seguidores', zh: '总粉丝数' },
    'Taxa de Engajamento': { pt: 'Taxa de Engajamento', en: 'Engagement Rate', es: 'Tasa de Engagement', zh: '互动率' },
    'Média de Visualizações': { pt: 'Média de Visualizações', en: 'Average Views', es: 'Promedio de Visualizaciones', zh: '平均观看量' },
    'Frequência de Conteúdo': { pt: 'Frequência de Conteúdo', en: 'Content Frequency', es: 'Frecuencia de Contenido', zh: '内容频率' },
    'Seguidores': { pt: 'Seguidores', en: 'Followers', es: 'Seguidores', zh: '粉丝' },
    'Inscritos': { pt: 'Inscritos', en: 'Subscribers', es: 'Suscriptores', zh: '订阅者' },
    'Visualizações': { pt: 'Visualizações', en: 'Views', es: 'Vistas', zh: '观看次数' },
    'Público': { pt: 'Público', en: 'Audience', es: 'Público', zh: '受众' },
    'Estatísticas Sociais': { pt: 'Estatísticas Sociais', en: 'Social Stats', es: 'Estadísticas Sociales', zh: '社交统计' },
    'O que esperar': { pt: 'O que esperar', en: 'What to Expect', es: 'Qué Esperar', zh: '期待什么' },
    'Métricas': { pt: 'Métricas', en: 'Metrics', es: 'Métricas', zh: '指标' },
    'Total de Views Mensais': { pt: 'Total de Views Mensais', en: 'Total Monthly Views', es: 'Total de Vistas Mensuales', zh: '每月总观看次数' },
    'Seguidores por Plataforma': { pt: 'Seguidores por Plataforma', en: 'Followers by Platform', es: 'Seguidores por Plataforma', zh: '各平台粉丝数' },
    'Views por Plataforma': { pt: 'Views por Plataforma', en: 'Views by Platform', es: 'Vistas por Plataforma', zh: '各平台观看次数' },

    // NEW: Demographics
    'Demografia do Público': { pt: 'Demografia do Público', en: 'Audience Demographics', es: 'Demografía de la Audiencia', zh: '受众人口统计' },
    'Faixa Etária': { pt: 'Faixa Etária', en: 'Age Range', es: 'Rango de Edad', zh: '年龄范围' },
    'Masculino': { pt: 'Masculino', en: 'Male', es: 'Masculino', zh: '男性' },
    'Feminino': { pt: 'Feminino', en: 'Female', es: 'Femenino', zh: '女性' },
    'Frequência': { pt: 'Frequência', en: 'Posting Frequency', es: 'Frecuencia', zh: '发布频率' },

    // Partnership
    'Investimento Mínimo': { pt: 'Investimento Mínimo', en: 'Minimum Investment', es: 'Inversión Mínima', zh: '最低投资' },
    'Tipo de Parceria': { pt: 'Tipo de Parceria', en: 'Partnership Type', es: 'Tipo de Asociación', zh: '合作类型' },
    'Todas as opções': { pt: 'Todas as opções', en: 'All options', es: 'Todas las opciones', zh: '所有选项' },

    // Common Words
    'Email': { pt: 'Email', en: 'Email', es: 'Correo', zh: '电子邮件' },
    'Telefone': { pt: 'Telefone', en: 'Phone', es: 'Teléfono', zh: '电话' },
    'Localização': { pt: 'Localização', en: 'Location', es: 'Ubicación', zh: '位置' },
    'Nicho': { pt: 'Nicho', en: 'Niche', es: 'Nicho', zh: '领域' },
    'Gerado em': { pt: 'Gerado em', en: 'Generated on', es: 'Generado el', zh: '生成于' },
};

export const TranslationService = {
    /**
     * Translates a given text to the target language.
     * Uses a dictionary for known static terms.
     * For unknown dynamic content, it returns the original text (simulating a "best effort" or requiring an external API).
     */
    translate: (text: string, lang: LanguageCode): string => {
        if (lang === 'pt') return text; // Default language

        // 1. Check exact match in dictionary
        if (DICTIONARY[text] && DICTIONARY[text][lang]) {
            return DICTIONARY[text][lang];
        }

        // 2. Try to find a partial match or case-insensitive match (simple heuristic)
        const lowerText = text.toLowerCase();
        const foundKey = Object.keys(DICTIONARY).find(k => k.toLowerCase() === lowerText);
        if (foundKey && DICTIONARY[foundKey][lang]) {
            return DICTIONARY[foundKey][lang];
        }

        // 3. Fallback for dynamic content (Real implementation would call an API like Google Translate here)
        // For this demo, we'll just return the text, or simulate translation for specific demo data if needed.
        return text;
    },

    /**
     * Batch translates an object or array of strings.
     */
    translateObject: (obj: any, lang: LanguageCode): any => {
        if (typeof obj === 'string') {
            return TranslationService.translate(obj, lang);
        }
        if (Array.isArray(obj)) {
            return obj.map(item => TranslationService.translateObject(item, lang));
        }
        if (typeof obj === 'object' && obj !== null) {
            const newObj: any = {};
            for (const key in obj) {
                newObj[key] = TranslationService.translateObject(obj[key], lang);
            }
            return newObj;
        }
        return obj;
    }
};
