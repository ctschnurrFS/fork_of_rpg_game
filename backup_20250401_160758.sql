--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12
-- Dumped by pg_dump version 15.12 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO neondb_owner;

--
-- Name: user_class; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.user_class AS ENUM (
    'Fighter',
    'Rogue',
    'Warlock',
    'Barbarian',
    'Sorcerer',
    'Paladin',
    'Druid'
);


ALTER TYPE public.user_class OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: neondb_owner
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: neondb_owner
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE drizzle.__drizzle_migrations_id_seq OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: neondb_owner
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: accounts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    provider_account_id text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.accounts OWNER TO neondb_owner;

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accounts_id_seq OWNER TO neondb_owner;

--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    team_id integer NOT NULL,
    user_id integer,
    action text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL,
    ip_address character varying(45)
);


ALTER TABLE public.activity_logs OWNER TO neondb_owner;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.activity_logs_id_seq OWNER TO neondb_owner;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: game_locations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.game_locations (
    location_id text NOT NULL,
    description text NOT NULL,
    doors jsonb DEFAULT '{"north": {"travel_string": "You walk north.", "destination_id": "castle_hall", "door_description": "North lies the castle hall."}}'::jsonb NOT NULL
);


ALTER TABLE public.game_locations OWNER TO neondb_owner;

--
-- Name: invitations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.invitations (
    id integer NOT NULL,
    team_id integer NOT NULL,
    email character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    invited_by integer NOT NULL,
    invited_at timestamp without time zone DEFAULT now() NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL
);


ALTER TABLE public.invitations OWNER TO neondb_owner;

--
-- Name: invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.invitations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invitations_id_seq OWNER TO neondb_owner;

--
-- Name: invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.invitations_id_seq OWNED BY public.invitations.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    session_token text NOT NULL,
    user_id integer NOT NULL,
    expires timestamp with time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: team_members; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.team_members (
    id integer NOT NULL,
    user_id integer NOT NULL,
    team_id integer NOT NULL,
    role character varying(50) NOT NULL,
    joined_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.team_members OWNER TO neondb_owner;

--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.team_members_id_seq OWNER TO neondb_owner;

--
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- Name: teams; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    stripe_customer_id text,
    stripe_subscription_id text,
    stripe_product_id text,
    plan_name character varying(50),
    subscription_status character varying(20)
);


ALTER TABLE public.teams OWNER TO neondb_owner;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.teams_id_seq OWNER TO neondb_owner;

--
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- Name: user_purchase; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_purchase (
    user_purchase_id integer NOT NULL,
    user_id integer,
    item_name character varying(100),
    price numeric(5,2),
    purchase_date timestamp without time zone DEFAULT now(),
    quantity integer,
    user_name character varying(100)
);


ALTER TABLE public.user_purchase OWNER TO neondb_owner;

--
-- Name: user_purchase_user_purchase_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.user_purchase ALTER COLUMN user_purchase_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_purchase_user_purchase_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role character varying(20) DEFAULT 'member'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    class public.user_class,
    location_id text DEFAULT 'castle_courtyard'::text NOT NULL,
    email_verified timestamp without time zone,
    image text
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: neondb_owner
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: invitations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invitations ALTER COLUMN id SET DEFAULT nextval('public.invitations_id_seq'::regclass);


--
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: neondb_owner
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	5a710a65173f1c510ebe80d425fbaa0696bdc850f77be850e3bff22e5bcc5ebb	1726443359662
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.activity_logs (id, team_id, user_id, action, "timestamp", ip_address) FROM stdin;
1	1	1	SIGN_IN	2025-03-04 16:17:40.370562	
2	1	1	INVITE_TEAM_MEMBER	2025-03-04 16:18:44.021474	
3	1	1	UPDATE_ACCOUNT	2025-03-04 16:19:38.550273	
4	1	1	SIGN_IN	2025-03-07 14:17:16.585557	
5	2	3	CREATE_TEAM	2025-03-07 14:32:43.897234	
6	2	3	SIGN_UP	2025-03-07 14:32:43.973912	
7	2	3	UPDATE_ACCOUNT	2025-03-07 14:34:37.991108	
8	3	4	CREATE_TEAM	2025-03-07 15:23:21.527812	
9	3	4	SIGN_UP	2025-03-07 15:23:21.605504	
10	3	4	SIGN_OUT	2025-03-07 15:31:55.932134	
11	1	1	SIGN_IN	2025-03-09 17:05:28.150752	
12	2	3	SIGN_IN	2025-03-17 17:14:21.413571	
13	1	1	SIGN_IN	2025-03-20 15:02:34.557578	
14	1	5	SIGN_IN	2025-03-21 14:03:11.930548	
15	1	5	SIGN_IN	2025-03-24 16:26:43.741753	
16	1	5	UPDATE_ACCOUNT	2025-03-24 16:48:36.823701	
17	1	5	UPDATE_ACCOUNT	2025-03-24 16:50:38.089933	
18	1	5	UPDATE_ACCOUNT	2025-03-24 17:00:21.879092	
19	1	5	UPDATE_ACCOUNT	2025-03-24 17:00:22.819823	
20	1	5	UPDATE_ACCOUNT	2025-03-24 17:00:57.987255	
21	1	5	UPDATE_ACCOUNT	2025-03-24 17:04:07.221973	
22	2	3	SIGN_IN	2025-03-24 17:07:43.484516	
23	1	5	UPDATE_ACCOUNT	2025-03-24 18:09:44.944708	
24	1	5	SIGN_OUT	2025-03-24 18:09:54.829831	
25	1	6	SIGN_IN	2025-03-24 18:10:16.896937	
26	1	1	SIGN_IN	2025-03-24 18:13:31.404274	
27	1	1	SIGN_OUT	2025-03-25 16:44:59.452317	
28	1	1	SIGN_IN	2025-03-25 16:45:28.805464	
29	2	3	SIGN_IN	2025-03-26 17:39:33.104518	
30	1	5	SIGN_IN	2025-03-26 18:03:05.042316	
31	1	5	SIGN_IN	2025-03-27 12:06:30.697607	
32	1	5	SIGN_OUT	2025-03-27 15:22:11.228269	
33	1	6	SIGN_IN	2025-03-27 15:22:22.341077	
34	1	6	SIGN_OUT	2025-03-27 16:16:20.659523	
35	1	5	SIGN_IN	2025-03-27 16:16:31.061585	
36	1	5	SIGN_OUT	2025-03-27 16:27:39.178174	
37	1	6	SIGN_IN	2025-03-27 16:27:49.400055	
38	1	6	SIGN_OUT	2025-03-27 17:38:15.841394	
39	1	5	SIGN_IN	2025-03-27 17:38:26.095485	
40	1	5	SIGN_OUT	2025-03-27 18:47:37.9615	
41	1	6	SIGN_IN	2025-03-27 18:47:51.810579	
42	1	6	SIGN_OUT	2025-03-27 18:51:09.021791	
43	1	5	SIGN_IN	2025-03-27 18:51:16.608803	
44	1	5	SIGN_OUT	2025-03-27 18:51:25.875691	
45	1	6	SIGN_IN	2025-03-27 18:51:35.333311	
46	1	6	SIGN_OUT	2025-03-27 20:17:15.898717	
47	1	5	SIGN_IN	2025-03-27 20:17:25.182864	
48	1	5	SIGN_OUT	2025-03-27 20:24:39.485649	
49	1	6	SIGN_IN	2025-03-27 20:24:48.546981	
50	1	6	SIGN_OUT	2025-03-27 20:55:03.643861	
51	1	5	SIGN_IN	2025-03-27 20:55:15.595714	
52	1	5	SIGN_OUT	2025-03-27 20:56:46.705506	
53	1	6	SIGN_IN	2025-03-27 20:56:58.909586	
54	1	6	SIGN_OUT	2025-03-27 21:04:18.026791	
55	1	5	SIGN_IN	2025-03-27 21:04:39.43803	
56	1	5	SIGN_OUT	2025-03-27 21:05:05.046813	
57	1	6	SIGN_IN	2025-03-27 21:05:16.721815	
58	1	6	SIGN_OUT	2025-03-27 21:49:23.874241	
59	1	5	SIGN_IN	2025-03-27 21:49:32.466455	
60	1	5	SIGN_OUT	2025-03-28 11:47:32.489475	
61	1	6	SIGN_IN	2025-03-28 11:47:50.29739	
62	1	6	SIGN_OUT	2025-03-28 13:36:01.016742	
63	1	1	SIGN_IN	2025-03-31 13:19:39.507736	
64	1	6	SIGN_IN	2025-03-31 16:49:48.081164	
65	1	6	SIGN_OUT	2025-03-31 16:51:30.996779	
66	1	6	SIGN_IN	2025-03-31 16:53:00.582979	
67	1	6	SIGN_OUT	2025-04-01 16:09:05.430311	
68	1	6	SIGN_IN	2025-04-01 16:09:32.320139	
69	1	6	SIGN_OUT	2025-04-01 16:09:45.766021	
70	1	6	SIGN_IN	2025-04-01 16:37:54.165529	
71	1	6	SIGN_OUT	2025-04-01 16:38:09.735439	
\.


--
-- Data for Name: game_locations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.game_locations (location_id, description, doors) FROM stdin;
castle_garden	Nestled within the castle walls, the garden is a tranquil oasis of vibrant greenery and delicate blooms. Neatly trimmed hedges form winding paths, guiding the way past stone benches and bubbling fountains. Towering oaks and willows offer shade, their branches swaying gently in the breeze. Flower beds overflow with roses, violets, and lavender, filling the air with a sweet, calming fragrance. Birds flit between trellises draped in ivy, and a small koi pond reflects the sky in shimmering ripples. Despite the castle’s imposing presence, the garden exudes a quiet serenity, untouched by the world beyond the walls.	{"east": {"travel_string": "You walk east.", "destination_id": "castle_courtyard", "door_description": "East lies the castle courtyard."}}
castle_courtyard	The castle courtyard is a wide expanse of weathered cobblestones, enclosed by towering stone walls. A grand fountain at the center spills clear water from a carved lion’s head, its steady flow echoing softly. Banners bearing the royal crest ripple in the breeze, adding color to the gray stone. Wooden training dummies and weapon racks stand near the edges, while a few market stalls display fresh goods and simple wares. The scent of hay drifts from a small stable alcove, mingling with the crisp air. Overhead, ravens circle, their calls fading into the wind.	{"west": {"travel_string": "You walk west to the garden.", "destination_id": "castle_garden", "door_description": "The castle garden is West."}, "north": {"travel_string": "You walk north to the hall.", "destination_id": "castle_hall", "door_description": "North lies the castle hall."}}
castle_hall	The castle hall is a vast chamber of towering stone columns and vaulted ceilings, dimly lit by flickering torches in iron sconces. A long banquet table stretches down the center, its surface scarred from countless feasts and council meetings. Heavy banners hang from the walls, their embroidered crests faded with age. At the far end, a raised dais holds a grand wooden throne, its carvings worn smooth by time. The air carries the scent of burning wood and aged parchment, mingling with the distant murmur of footsteps echoing through the stone corridors.	{"south": {"travel_string": "You walk south.", "destination_id": "castle_courtyard", "door_description": "South lies the castle courtyard."}}
\.


--
-- Data for Name: invitations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.invitations (id, team_id, email, role, invited_by, invited_at, status) FROM stdin;
1	1	pmcisaac@gmail.com	owner	1	2025-03-04 16:18:43.961073	pending
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (session_token, user_id, expires) FROM stdin;
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.team_members (id, user_id, team_id, role, joined_at) FROM stdin;
1	1	1	owner	2025-03-04 11:31:15.337794
2	3	2	owner	2025-03-07 14:32:44.242223
3	4	3	owner	2025-03-07 15:23:21.908615
4	6	1	admin	2025-03-21 13:56:15.814539
6	5	1	user	2025-03-21 13:59:42.49752
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.teams (id, name, created_at, updated_at, stripe_customer_id, stripe_subscription_id, stripe_product_id, plan_name, subscription_status) FROM stdin;
1	Test Team	2025-03-04 11:31:15.248025	2025-03-04 11:31:15.248025	\N	\N	\N	\N	\N
2	ctschnurr@gmail.com's Team	2025-03-07 14:32:43.823091	2025-03-07 14:32:43.823091	\N	\N	\N	\N	\N
3	b.delaney@deopdesign.com's Team	2025-03-07 15:23:21.452343	2025-03-07 15:23:21.452343	\N	\N	\N	\N	\N
\.


--
-- Data for Name: user_purchase; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_purchase (user_purchase_id, user_id, item_name, price, purchase_date, quantity, user_name) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, name, email, password_hash, role, created_at, updated_at, deleted_at, class, location_id, email_verified, image) FROM stdin;
3	Christopher Schnurr	ctschnurr@gmail.com	$2a$10$X83Mzq/FfkOhR2KNv13SueGM1FSmIKxCxJPXoGwIueV7Wz0KPHbaq	owner	2025-03-07 14:32:43.742021	2025-03-07 14:32:43.742021	\N	Rogue	castle_courtyard	\N	\N
5	user	user@example.com	$2y$10$UD8RBwMbcCD7h1YooNoq9uC0lA9QRkzfU0epO5VHsZt4xloZVdPZO	regular	2025-03-19 16:38:34.397433	2025-03-24 18:09:44.789	\N	Druid	castle_courtyard	\N	\N
1	Paul McIsaac	test@test.com	$2a$10$S5R4YD4HNqW2ORE0yihpJu3fcbjZAVIyCONG92f3StC/4zzm/9GU2	owner	2025-03-04 11:31:15.153901	2025-03-04 11:31:15.153901	\N	Warlock	castle_courtyard	\N	\N
6	admin	admin@example.com	$2a$12$xhlJ0pnZr/PfEuzWH1TygO1V4NIeytnXsgIikmrLkD2e5fAGvs.xC	admin	2025-03-19 16:41:09.615434	2025-03-19 16:41:09.615434	\N	Fighter	castle_courtyard	\N	\N
4	Brian Delaney	b.delaney@deopdesign.com	$2a$10$Jf02kAyTV268euFv7/ioI.pg.EGU5oHi/qsrNhvcWP/sG235u2g6G	owner	2025-03-07 15:23:21.369064	2025-03-07 15:23:21.369064	\N	Paladin	castle_courtyard	\N	\N
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: neondb_owner
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, true);


--
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.accounts_id_seq', 1, false);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 71, true);


--
-- Name: invitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.invitations_id_seq', 1, true);


--
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.team_members_id_seq', 6, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.teams_id_seq', 3, true);


--
-- Name: user_purchase_user_purchase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_purchase_user_purchase_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: neondb_owner
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_provider_provider_account_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_provider_provider_account_id_key UNIQUE (provider, provider_account_id);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: game_locations game_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.game_locations
    ADD CONSTRAINT game_locations_pkey PRIMARY KEY (location_id);


--
-- Name: invitations invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (session_token);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: teams teams_stripe_customer_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_stripe_customer_id_unique UNIQUE (stripe_customer_id);


--
-- Name: teams teams_stripe_subscription_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_stripe_subscription_id_unique UNIQUE (stripe_subscription_id);


--
-- Name: user_purchase user_purchase_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_purchase
    ADD CONSTRAINT user_purchase_pkey PRIMARY KEY (user_purchase_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: activity_logs activity_logs_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: activity_logs activity_logs_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: invitations invitations_invited_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_invited_by_users_id_fk FOREIGN KEY (invited_by) REFERENCES public.users(id);


--
-- Name: invitations invitations_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: users player_location; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT player_location FOREIGN KEY (location_id) REFERENCES public.game_locations(location_id) ON DELETE SET DEFAULT;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: team_members team_members_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: team_members team_members_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES  TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

