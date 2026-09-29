-- =============================================================================
-- Lion Park — criação do esquema
-- PostgreSQL 16
-- =============================================================================
-- Execução:
--   docker exec -i lionpark_db psql -U postgres -d lionpark_db < schema.sql
--
-- NOTA: o projeto não usa migrations do EF Core. Este script é a definição
-- canônica do esquema e deve ser mantido em sincronia com as entidades de
-- LionPark.Domain e com o mapeamento em LionParkDbContext.
--
-- A nomenclatura snake_case corresponde à conversão automática aplicada em
-- LionParkDbContext.OnModelCreating — não altere sem ajustar o contexto.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- users — funcionários do sistema E clientes do estacionamento
-- Distinguidos pela coluna role: 'Admin', 'Operator' ou 'Customer'
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name     VARCHAR(255) NOT NULL,
    cpf           VARCHAR(20)  UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT         NOT NULL,              -- Argon2, sal incorporado
    role          VARCHAR(50)  NOT NULL,              -- Admin | Operator | Customer
    plan_type     VARCHAR(50)  NOT NULL DEFAULT 'Padrão',  -- Padrão | Mensalista
    payment_day   INT          NOT NULL DEFAULT 10,   -- dia de vencimento (1-31)
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- vehicles — veículos vinculados a um proprietário
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_plate VARCHAR(20)  UNIQUE NOT NULL,       -- chave de busca operacional
    model         VARCHAR(100) NOT NULL,
    color         VARCHAR(50)  NOT NULL,
    category      VARCHAR(50)  NOT NULL,              -- Carro | Moto
    user_id       UUID         NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicles_users FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- parking_spots — vagas físicas do estabelecimento
-- is_occupied é sincronizado pelas operações de entrada e saída
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS parking_spots (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identification VARCHAR(50) UNIQUE NOT NULL,       -- ex.: A-01, B-05
    is_occupied    BOOLEAN     NOT NULL DEFAULT FALSE,
    category       VARCHAR(50) NOT NULL,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- parking_records — movimentações do pátio
-- exit_time IS NULL  <=>  veículo ainda no pátio
-- FK sem CASCADE: preserva o histórico financeiro contra exclusão de cadastro
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS parking_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_time      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    exit_time       TIMESTAMP WITH TIME ZONE,          -- NULL = em aberto
    total_amount    DECIMAL(10, 2),                    -- NULL até o encerramento
    vehicle_id      UUID NOT NULL,
    parking_spot_id UUID NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_records_vehicles FOREIGN KEY (vehicle_id)
        REFERENCES vehicles (id),
    CONSTRAINT fk_records_spots FOREIGN KEY (parking_spot_id)
        REFERENCES parking_spots (id)
);

-- -----------------------------------------------------------------------------
-- price_rules — catálogo de tarifas
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS price_rules (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100)   NOT NULL,
    type       VARCHAR(50)    NOT NULL,                -- Fração | Hora | Diária | Mensal
    price      DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- subscription_payments — pagamentos de mensalidade por competência
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscription_payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID           NOT NULL,
    reference_month INT            NOT NULL,           -- 1-12
    reference_year  INT            NOT NULL,
    amount          DECIMAL(10, 2) NOT NULL,
    payment_date    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subscription_users FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- Índices de apoio às consultas mais frequentes
-- (os índices únicos já são criados pelas constraints UNIQUE acima)
-- -----------------------------------------------------------------------------

-- Listagem do pátio: WHERE exit_time IS NULL
CREATE INDEX IF NOT EXISTS ix_parking_records_active
    ON parking_records (exit_time)
    WHERE exit_time IS NULL;

-- Relatório financeiro: WHERE exit_time BETWEEN ... AND ...
CREATE INDEX IF NOT EXISTS ix_parking_records_exit_time
    ON parking_records (exit_time);

-- Veículos de um proprietário
CREATE INDEX IF NOT EXISTS ix_vehicles_user_id
    ON vehicles (user_id);

-- Status de mensalidade por competência
CREATE INDEX IF NOT EXISTS ix_subscription_payments_competencia
    ON subscription_payments (reference_year, reference_month);

-- Filtro de mensalistas ativos
CREATE INDEX IF NOT EXISTS ix_users_plan_active
    ON users (plan_type, is_active);

COMMIT;

-- =============================================================================
-- Verificação
-- =============================================================================
-- \dt                       lista as 6 tabelas
-- \d users                  detalha colunas e constraints
--
-- SELECT table_name, COUNT(*) AS colunas
--   FROM information_schema.columns
--  WHERE table_schema = 'public'
--  GROUP BY table_name ORDER BY table_name;
-- =============================================================================
