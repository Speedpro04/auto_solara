-- Ativação da extensão pgvector para embeddings futuros
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabela RAG de Knowledge Base para Solara Auto (Revendas de Veículos)
CREATE TABLE IF NOT EXISTS public.auto_knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    keywords TEXT[] NOT NULL,
    context TEXT NOT NULL,
    priority_level INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.auto_knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso de leitura público para IA Auto"
    ON public.auto_knowledge_base FOR SELECT
    USING (true);

INSERT INTO public.auto_knowledge_base (topic, keywords, context, priority_level) VALUES
('Financiamento e Entrada', ARRAY['financiamento', 'parcela', 'entrada', 'aprovação', 'score', 'cpf', 'crédito', 'banco', 'consórcio', 'finame', 'cdc'], 'Ponto crucial da venda. O lead quer saber se consegue pagar. A IA deve informar: "Trabalhamos com todos os bancos, entrada a partir de X%, aprovação em até 30min." Puxar para simulação imediata.', 3),
('Troca e Retoma', ARRAY['troca', 'retoma', 'meu carro', 'usado na troca', 'trocar carro', 'vale quanto', 'avaliação', 'avaliar meu carro'], 'Lead quente. Já possui veículo e quer trocar. Oferecer avaliação gratuita presencial ou por foto. Focar em facilidade: "Traga seu carro, avaliamos na hora e abatemos do novo."', 3),
('Documentação e Transferência', ARRAY['documento', 'transferência', 'ipva', 'multa', 'detran', 'licenciamento', 'alienação', 'debito', 'pendência'], 'Questão burocrática que trava vendas. A IA deve tranquilizar: "Cuidamos de toda documentação. Entregamos o veículo com tudo regularizado." Upsell: serviço de despachante incluso.', 2),
('Garantia e Procedência', ARRAY['garantia', 'procedência', 'batido', 'sinistro', 'leilão', 'vistoria cautelar', 'laudo', 'quilometragem', 'km original'], 'Medo principal do comprador de semi-novo. Responder com transparência: "Todos nossos veículos passam por vistoria cautelar completa e têm laudo disponível." Gera confiança imediata.', 2),
('Seguro Automotivo', ARRAY['seguro', 'seguro auto', 'proteção veicular', 'cobertura', 'franquia', 'roubo', 'furto', 'terceiros', 'compreensivo'], 'Cross-sell importante. Após fechar a venda, oferecer seguro com parceiro. "Saia da loja já com seu carro segurado. Cotação em 5 min." Aumenta ticket médio.', 1),
('Revisão e Manutenção', ARRAY['revisão', 'manutenção', 'troca de óleo', 'pneu', 'freio', 'suspensão', 'barulho', 'problema mecânico', 'oficina'], 'Pós-venda e retenção. A IA deve sugerir pacotes de revisão programada. "Oferecemos revisão dos 1.000 km grátis." Cria vínculo e gera indicações.', 1),
('Veículos Populares e Econômicos', ARRAY['popular', 'econômico', 'barato', 'até 50 mil', 'primeiro carro', 'hb20', 'onix', 'argo', 'gol', 'uno', 'mobi', 'kwid'], 'Público sensível a preço. Focar em custo-benefício, economia de combustível e seguro barato. Mostrar tabela FIPE como referência de honestidade.', 1),
('SUVs e Crossovers', ARRAY['suv', 'crossover', 'creta', 'tracker', 'compass', 'renegade', 't-cross', 'kicks', 'hr-v', 'sportage'], 'Categoria em alta. Focar em espaço interno, segurança e tecnologia embarcada. Ideal para famílias. Upsell de acessórios (rack de teto, película).', 2),
('Picapes e Utilitários', ARRAY['picape', 'hilux', 'ranger', 'amarok', 's10', 'frontier', 'saveiro', 'strada', 'toro', 'montana', 'utilitário'], 'Público rural e empresarial. Focar em robustez, capacidade de carga e torque. Oferecer opções de financiamento via CNPJ para MEI/empresas.', 2),
('Carros Elétricos e Híbridos', ARRAY['elétrico', 'híbrido', 'byd', 'tesla', 'bev', 'plug-in', 'eletrico', 'corolla cross', 'dolphin', 'autonomia'], 'Segmento premium e em crescimento. Focar em economia de combustível zero, manutenção reduzida e tecnologia. Ideal para público conectado e sustentável.', 1),
('Test Drive e Agendamento', ARRAY['test drive', 'experimentar', 'ver o carro', 'agendar visita', 'quero ver', 'posso ir', 'horário', 'quando posso ir'], 'Sinal forte de compra iminente. A IA deve fechar o agendamento imediatamente: "Perfeito! Qual horário fica melhor pra você? Manhã ou tarde?" Nunca deixar o lead esfriar.', 3),
('Acessórios e Personalização', ARRAY['acessório', 'película', 'som', 'multimídia', 'rodas', 'rebaixar', 'kit gás', 'gnv', 'envelopamento', 'insulfilm'], 'Upsell pós-venda. Oferecer pacotes de personalização na hora da entrega. "Monte o carro do jeito que você sonhou." Aumenta ticket médio em 10-20%.', 1),
('Motos', ARRAY['moto', 'motocicleta', 'cg', 'biz', 'pcx', 'cb', 'xre', 'fazer', 'yamaha', 'honda', 'suzuki', 'scooter'], 'Segmento de volume e agilidade. Público jovem ou de delivery. Focar em economia, agilidade no trânsito e parcelas acessíveis.', 1),
('FIPE e Negociação', ARRAY['fipe', 'tabela fipe', 'preço justo', 'desconto', 'negociar', 'valor', 'quanto custa', 'promoção', 'oferta'], 'Fase de negociação. A IA deve demonstrar transparência com a FIPE e justificar o preço (vistoria cautelar, garantia, revisão feita). Nunca dar desconto direto — oferecer benefício (acessório, revisão grátis).', 3);
