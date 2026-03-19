-- Starto V2 Database Schema
-- Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Users Table
CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid      VARCHAR(128) UNIQUE NOT NULL,
  username          VARCHAR(50) UNIQUE,
  name              VARCHAR(255) NOT NULL,
  email             VARCHAR(255) UNIQUE NOT NULL,
  phone             VARCHAR(20),
  role              VARCHAR(50) NOT NULL,
  industry          VARCHAR(100),
  sub_industry      VARCHAR(100),
  city              VARCHAR(100),
  state             VARCHAR(100),
  country           VARCHAR(100) DEFAULT 'India',
  lat               DECIMAL(10,8),
  lng               DECIMAL(11,8),
  location_point    GEOGRAPHY(POINT, 4326),
  bio               TEXT,
  avatar_url        TEXT,
  website_url       TEXT,
  linkedin_url      TEXT,
  plan              VARCHAR(20) DEFAULT 'free',
  plan_expires_at   TIMESTAMPTZ,
  signal_count      INTEGER DEFAULT 0,
  network_size      INTEGER DEFAULT 0,
  network_tier      VARCHAR(20) DEFAULT 'local',
  is_online         BOOLEAN DEFAULT false,
  last_seen         TIMESTAMPTZ,
  is_verified       BOOLEAN DEFAULT false,
  is_active         BOOLEAN DEFAULT true,
  fcm_token         TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Signals Table
CREATE TABLE signals (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE,
  type             VARCHAR(50) NOT NULL,
  category         VARCHAR(100),
  title            VARCHAR(255) NOT NULL,
  description      TEXT NOT NULL,
  stage            VARCHAR(50),
  city             VARCHAR(100),
  state            VARCHAR(100),
  lat              DECIMAL(10,8),
  lng              DECIMAL(11,8),
  location_point   GEOGRAPHY(POINT, 4326),
  timeline_days    INTEGER,
  compensation     VARCHAR(100),
  visibility       VARCHAR(20) DEFAULT 'global',
  status           VARCHAR(20) DEFAULT 'open',
  signal_strength  VARCHAR(20) DEFAULT 'normal',
  response_count   INTEGER DEFAULT 0,
  offer_count      INTEGER DEFAULT 0,
  view_count       INTEGER DEFAULT 0,
  is_boosted       BOOLEAN DEFAULT false,
  boost_expires_at TIMESTAMPTZ,
  expires_at       TIMESTAMPTZ DEFAULT now() + INTERVAL '7 days',
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_signals_location ON signals USING GIST(location_point);
CREATE INDEX idx_signals_city ON signals(city);
CREATE INDEX idx_signals_type ON signals(type);
CREATE INDEX idx_signals_status ON signals(status);
CREATE INDEX idx_signals_created ON signals(created_at DESC);
CREATE INDEX idx_signals_search ON signals USING GIN(to_tsvector('english', title || ' ' || description));

-- Responses Table
CREATE TABLE responses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id   UUID REFERENCES signals(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  type        VARCHAR(30) DEFAULT 'respond',
  status      VARCHAR(20) DEFAULT 'pending',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Connections Table
CREATE TABLE connections (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES users(id),
  receiver_id  UUID REFERENCES users(id),
  status       VARCHAR(20) DEFAULT 'pending',
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(requester_id, receiver_id)
);

-- Messages Table
CREATE TABLE messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id    UUID REFERENCES users(id),
  receiver_id  UUID REFERENCES users(id),
  content      TEXT NOT NULL,
  is_read      BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Notifications Table
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(50) NOT NULL,
  title       VARCHAR(255),
  body        TEXT,
  data        JSONB,
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- User Behavior Table
CREATE TABLE user_behavior (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  signal_id   UUID REFERENCES signals(id) ON DELETE SET NULL,
  action      VARCHAR(30),
  query       TEXT,
  category    VARCHAR(100),
  duration_ms INTEGER,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Explore Reports Table
CREATE TABLE explore_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  location        VARCHAR(255),
  industry        VARCHAR(100),
  budget          BIGINT,
  stage           VARCHAR(50),
  target_customer VARCHAR(50),
  report_data     JSONB NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions Table
CREATE TABLE subscriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id),
  plan              VARCHAR(20) NOT NULL,
  razorpay_order_id VARCHAR(255),
  razorpay_sub_id   VARCHAR(255),
  payment_id        VARCHAR(255),
  status            VARCHAR(20) DEFAULT 'active',
  amount            INTEGER,
  currency          VARCHAR(10) DEFAULT 'INR',
  started_at        TIMESTAMPTZ DEFAULT now(),
  expires_at        TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ
);

-- Nearby Spaces Table
CREATE TABLE nearby_spaces (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  type          VARCHAR(50),
  address       TEXT,
  city          VARCHAR(100),
  state         VARCHAR(100),
  lat           DECIMAL(10,8),
  lng              DECIMAL(11,8),
  location_point GEOGRAPHY(POINT, 4326),
  description   TEXT,
  contact       TEXT,
  website       TEXT,
  verified      BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_nearby_location ON nearby_spaces USING GIST(location_point);
