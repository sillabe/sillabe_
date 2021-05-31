import { z } from 'zod';

export const supportedTemplateEngines = {
    ejs: 'ejs',
    haml: 'haml',
    handlebars: 'hbs',
    liquid: 'lqd',
    nunjucks: 'njk',
    pug: 'pug',
    swig: 'swig',
    twig: 'twig',
};

export const ConfigurationSchema = z.object({
    content: z.string().nonempty(),
    build: z.string().nonempty(),
    views: z.string().nonempty(),
    public: z.string().nonempty(),
    templateEngine: z.enum(Object.keys(supportedTemplateEngines) as [string, ...string[]]),
    plugins: z.any().array(),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;
export type TemplateEngine = keyof typeof supportedTemplateEngines;
