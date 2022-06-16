--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1 (Debian 14.1-1.pgdg110+1)
-- Dumped by pg_dump version 14.1 (Debian 14.1-1.pgdg110+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Device; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Device" (
    id integer NOT NULL,
    slug text NOT NULL,
    contact text,
    website text,
    validation boolean DEFAULT false NOT NULL,
    image text,
    "labelId" integer,
    "descriptionId" integer,
    "markdownId" integer
);


ALTER TABLE public."Device" OWNER TO postgres;

--
-- Name: Device_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Device_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Device_id_seq" OWNER TO postgres;

--
-- Name: Device_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Device_id_seq" OWNED BY public."Device".id;


--
-- Name: Domain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Domain" (
    id integer NOT NULL,
    slug text NOT NULL,
    validation boolean DEFAULT false NOT NULL,
    "labelId" integer,
    "descriptionId" integer
);


ALTER TABLE public."Domain" OWNER TO postgres;

--
-- Name: Domain_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Domain_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Domain_id_seq" OWNER TO postgres;

--
-- Name: Domain_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Domain_id_seq" OWNED BY public."Domain".id;


--
-- Name: Element_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Element_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Element_id_seq" OWNER TO postgres;

--
-- Name: Element; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Element" (
    id integer DEFAULT nextval('public."Element_id_seq"'::regclass) NOT NULL,
    accuracy double precision,
    "sensorId" integer NOT NULL,
    "phenomenonId" integer NOT NULL,
    "unitId" integer
);


ALTER TABLE public."Element" OWNER TO postgres;

--
-- Name: Language; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Language" (
    code character varying(2) NOT NULL,
    label character varying(255)
);


ALTER TABLE public."Language" OWNER TO postgres;

--
-- Name: Phenomenon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Phenomenon" (
    id integer NOT NULL,
    slug text NOT NULL,
    validation boolean DEFAULT false NOT NULL,
    "labelId" integer,
    "descriptionId" integer,
    "markdownId" integer
);


ALTER TABLE public."Phenomenon" OWNER TO postgres;

--
-- Name: Phenomenon_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Phenomenon_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Phenomenon_id_seq" OWNER TO postgres;

--
-- Name: Phenomenon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Phenomenon_id_seq" OWNED BY public."Phenomenon".id;


--
-- Name: RangeOfValues_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RangeOfValues_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."RangeOfValues_id_seq" OWNER TO postgres;

--
-- Name: RangeOfValues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RangeOfValues" (
    id integer DEFAULT nextval('public."RangeOfValues_id_seq"'::regclass) NOT NULL,
    min integer,
    max integer,
    "unitId" integer NOT NULL,
    "phenomenonId" integer NOT NULL
);


ALTER TABLE public."RangeOfValues" OWNER TO postgres;

--
-- Name: Sensor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Sensor" (
    id integer NOT NULL,
    slug text NOT NULL,
    manufacturer text,
    "lifePeriod" integer,
    price double precision,
    validation boolean DEFAULT false NOT NULL,
    image text,
    datasheet text,
    "labelId" integer,
    "descriptionId" integer
);


ALTER TABLE public."Sensor" OWNER TO postgres;

--
-- Name: Sensor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Sensor_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Sensor_id_seq" OWNER TO postgres;

--
-- Name: Sensor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Sensor_id_seq" OWNED BY public."Sensor".id;


--
-- Name: Translation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Translation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Translation_id_seq" OWNER TO postgres;

--
-- Name: Translation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Translation" (
    id integer DEFAULT nextval('public."Translation_id_seq"'::regclass) NOT NULL
);


ALTER TABLE public."Translation" OWNER TO postgres;

--
-- Name: TranslationItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TranslationItem" (
    "languageCode" text NOT NULL,
    text character varying(4096) NOT NULL,
    "translationId" integer NOT NULL
);


ALTER TABLE public."TranslationItem" OWNER TO postgres;

--
-- Name: Unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Unit" (
    id integer NOT NULL,
    slug text NOT NULL,
    name character varying(255) NOT NULL,
    notation character varying(255) NOT NULL,
    validation boolean DEFAULT false NOT NULL,
    "descriptionId" integer
);


ALTER TABLE public."Unit" OWNER TO postgres;

--
-- Name: Unit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Unit_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Unit_id_seq" OWNER TO postgres;

--
-- Name: Unit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Unit_id_seq" OWNED BY public."Unit".id;


--
-- Name: _DeviceToSensor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_DeviceToSensor" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_DeviceToSensor" OWNER TO postgres;

--
-- Name: _DomainToPhenomenon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_DomainToPhenomenon" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_DomainToPhenomenon" OWNER TO postgres;

--
-- Name: Device id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Device" ALTER COLUMN id SET DEFAULT nextval('public."Device_id_seq"'::regclass);


--
-- Name: Domain id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Domain" ALTER COLUMN id SET DEFAULT nextval('public."Domain_id_seq"'::regclass);


--
-- Name: Phenomenon id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Phenomenon" ALTER COLUMN id SET DEFAULT nextval('public."Phenomenon_id_seq"'::regclass);


--
-- Name: Sensor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sensor" ALTER COLUMN id SET DEFAULT nextval('public."Sensor_id_seq"'::regclass);


--
-- Name: Unit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Unit" ALTER COLUMN id SET DEFAULT nextval('public."Unit_id_seq"'::regclass);


--
-- Data for Name: Device; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Device" (id, slug, contact, website, validation, image, "labelId", "descriptionId", "markdownId") FROM stdin;
1	sensebox_home	\N	\N	f	sensebox_home.jpg	1	2	3
2	sensebox_edu	\N	\N	f	sensebox_edu.jpg	4	5	6
3	airdatainfo_device	\N	\N	f	airdatainfo_device.jpeg	7	8	113
\.


--
-- Data for Name: Domain; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Domain" (id, slug, validation, "labelId", "descriptionId") FROM stdin;
1	air_quality	f	44	45
2	climate_phenomena	f	46	47
3	ground_phenomena	f	48	49
4	water_phenomena	f	142	143
\.


--
-- Data for Name: Element; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Element" (id, accuracy, "sensorId", "phenomenonId", "unitId") FROM stdin;
5	2	3	2	4
9	3	5	5	4
10	0.8	5	3	2
13	\N	8	8	\N
14	\N	25	9	\N
15	\N	25	10	\N
8	0.4	4	3	2
6	30	4	4	5
7	3	4	2	4
12	0	7	7	7
11	1	7	6	11
1	0.12	1	1	3
2	3	1	2	4
3	0	1	3	2
4	0.12	2	1	3
17	\N	43	9	\N
18	10	47	14	13
\.


--
-- Data for Name: Language; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Language" (code, label) FROM stdin;
en	English
de	German
es	Spanish
fr	French
\.


--
-- Data for Name: Phenomenon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Phenomenon" (id, slug, validation, "labelId", "descriptionId", "markdownId") FROM stdin;
1	barometric_pressure	f	23	24	25
2	relative_humidity	f	26	27	28
3	temperature	f	29	30	31
4	co2	f	32	33	34
5	soil_moisture	f	35	36	37
6	ambient_light	f	38	39	40
7	ultraviolet_a_light	t	41	42	43
8	humidity	f	104	105	106
9	pm25	f	107	108	109
10	pm10_concentration	f	110	111	112
13	air_temperature	f	136	137	138
14	precipitation	f	139	140	141
15	volatile_organic_compound_voc	f	146	147	148
16	voltage	f	149	150	151
17	sound_level	f	154	155	156
18	water_level	f	157	158	159
19	water_temperature	f	160	161	162
20	wind_direction	f	163	164	165
21	wind_speed	f	166	167	168
\.


--
-- Data for Name: RangeOfValues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RangeOfValues" (id, min, max, "unitId", "phenomenonId") FROM stdin;
1	0	100000	11	6
5	0	200	8	13
6	-273	200	2	13
7	\N	\N	13	14
8	\N	\N	14	16
9	\N	\N	15	21
\.


--
-- Data for Name: Sensor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Sensor" (id, slug, manufacturer, "lifePeriod", price, validation, image, datasheet, "labelId", "descriptionId") FROM stdin;
3	hdc1080	Texas Instruments	364	2.03	t	\N	\N	13	14
5	smt50	TRUEBNER GmbH	365	0	f	\N	\N	17	18
6	tsl4531	ams	50	0.5	f	\N	\N	19	20
8	bme280	\N	\N	\N	f	\N	\N	50	51
10	dht22	\N	\N	\N	f	\N	\N	54	55
11	ds18b20	\N	\N	\N	f	\N	\N	56	57
12	ds18s20	\N	\N	\N	f	\N	\N	58	59
13	hpm	\N	\N	\N	f	\N	\N	60	61
14	htu21d	\N	\N	\N	f	\N	\N	62	63
15	neo-6m	\N	\N	\N	f	\N	\N	64	65
16	no2-a43f	\N	\N	\N	f	\N	\N	66	67
17	pms1003	\N	\N	\N	f	\N	\N	68	69
18	pms3003	\N	\N	\N	f	\N	\N	70	71
19	pms5003	\N	\N	\N	f	\N	\N	72	73
20	pms6003	\N	\N	\N	f	\N	\N	74	75
21	pms7003	\N	\N	\N	f	\N	\N	76	77
22	ppd42ns	\N	\N	\N	f	\N	\N	78	79
23	sbm-19	\N	\N	\N	f	\N	\N	80	81
24	sbm-20	\N	\N	\N	f	\N	\N	82	83
25	sds011	\N	\N	\N	f	\N	\N	84	85
26	sds021	\N	\N	\N	f	\N	\N	86	87
27	sht10	\N	\N	\N	f	\N	\N	88	89
28	sht11	\N	\N	\N	f	\N	\N	90	91
29	sht15	\N	\N	\N	f	\N	\N	92	93
30	sht30	\N	\N	\N	f	\N	\N	94	95
31	sht31	\N	\N	\N	f	\N	\N	96	97
32	sht35	\N	\N	\N	f	\N	\N	98	99
33	sht85	\N	\N	\N	f	\N	\N	100	101
34	sps30	\N	\N	\N	f	\N	\N	102	103
4	scd30	Sensirion	5475	0	f	\N	\N	15	16
7	veml6070v2	Vishay	2	1	f	\N	https://pdf1.alldatasheet.com/datasheet-pdf/view/911505/VISHAY/VEML6070.html	21	22
1	bme680	Bosch	365	0	f	\N	\N	9	10
2	bmp280	Bosch Sensortec	360	23.7	f	\N	\N	11	12
36	as7262	\N	\N	\N	f	\N	\N	170	171
37	bmp085	Bosch	\N	\N	f	\N	\N	172	173
9	bmp180	Bosch	\N	\N	f	\N	\N	52	53
38	csm-m8q	\N	\N	\N	f	\N	\N	174	175
39	dht11	\N	\N	\N	f	\N	\N	176	177
40	gl5528	\N	\N	\N	f	\N	\N	178	179
41	grove_-_multichannel_gas_sensor	\N	\N	\N	f	\N	\N	180	181
42	hdc1008	\N	\N	\N	f	\N	\N	182	183
43	hm3301	\N	\N	\N	f	\N	\N	184	185
44	lm35	\N	\N	\N	f	\N	\N	186	187
45	lm386	\N	\N	\N	f	\N	\N	191	192
46	max4465	\N	\N	\N	f	\N	\N	193	194
48	ox-a431	\N	\N	\N	f	\N	\N	197	198
47	optical_rain_gauge_rg_15	\N	\N	\N	f	\N	https://files.seeedstudio.com/products/114992321/res/RG-15_instructions_sw_1.000.pdf	195	196
49	sen0232	DFRobot	\N	\N	f	\N	https://wiki.dfrobot.com/Gravity__Analog_Sound_Level_Meter_SKU_SEN0232	199	200
50	si22g	\N	\N	\N	f	\N	\N	201	202
51	tsl2561	\N	\N	\N	f	\N	\N	203	204
52	tx20	\N	\N	\N	f	\N	\N	205	206
\.


--
-- Data for Name: Translation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Translation" (id) FROM stdin;
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
120
121
123
124
125
134
135
136
137
138
139
140
141
142
143
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
\.


--
-- Data for Name: TranslationItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TranslationItem" ("languageCode", text, "translationId") FROM stdin;
de	Die senseBox:home ist ein Toolkit für Umweltmessungen.	2
de		3
de	Die senseBox:edu ist ein Toolkit für Umweltmessungen.	5
de		6
de	Gerät zur Messung der Lufqualität.	8
de	Der BME680 ist ein Gassensor, der hochlineare und hochgenaue Gas-, Druck-, Feuchte- und Temperatursensoren integriert.	10
de	Der barometrische Drucksensor BMP280 von Bosch Sensortec ist ein absoluter Drucksensor, der speziell für mobile Anwendungen entwickelt wurde. Er kann auch die Lufttemperatur messen.	12
de	HDC1080	13
en	HDC1080	13
de	Der Sensor HDC1080 von Texas Instruments ist ein digitaler Feuchtigkeitssensor. Er misst die relative Luftfeuchtigkeit und die Temperatur.	14
en	The Texas Instruments' HDC1080 sensor is a digital humidity sensor. It measures relative humidity and and temperature.	14
de	Der SCD30 von Sensirion ist ein hochwertiger, auf nicht-dispersivem Infrarot (NDIR) basierender CO₂-Sensor, der 400 bis 10000ppm mit einer Genauigkeit von ±(30ppm+3%) erfassen kann.	16
de	SMT50	17
en	SMT50	17
de	Der SMT50 wird von TRUEBNER entwickelt und hergestellt. Er ist ein FDR-Bodenfeuchtesensor. Das Gehäuse und das Kabel sind wasserdicht.	18
en	The SMT50 is designed and manufactured by TRUEBNER. It is a FDR soil moisture sensor. The casing and cable is water sealed.	18
de	TSL4531	19
en	TSL4531	19
de	Der AMS TSL4531 Lichtsensor ist ein Umgebungslichtsensor. Er erkennt also die Helligkeit des Umgebungslichts.	20
en	The AMS TSL4531 light sensor is an ambient light sensor. Therefore, it detects the brightness of ambient light.	20
de	Der VEML6070 ist ein fortschrittlicher Ultraviolett (UV)-Lichtsensor mitI2C-Protokollschnittstelle und wurde im CMOS-Verfahren entwickelt.	22
de	Der barometrische Druck ist der Druck in der Atmosphäre der Erde. Er wird auch als atmosphärischer Druck bezeichnet.	24
de		25
de	Die relative Luftfeuchtigkeit (RH) ist das Verhältnis zwischen dem Partialdruck von Wasserdampf und dem Gleichgewichtsdampfdruck von Wasser bei einer bestimmten Temperatur. (Quelle: Wikipedia)	27
de		28
de	Temperatur	29
en	Temperature	29
de	Beschreibt die Wärme eines Mediums.	30
en	Describes the warmness of a medium.	30
de		31
en		31
de	Kohlendioxid (CO2) wird in parts-per-per-million (ppm) gemessen.	33
de	test	34
de	Bodenfeuchte	35
en	Soil moisture	35
de	Bodenfeuchtesensoren messen den volumetrischen Wassergehalt im Boden.	36
en	Soil moisture sensors measure the volumetric water content in soil.	36
de		37
en		37
de	Die Intensität des Umgebungslichts entspricht der Reaktion des menschlichen Auges auf Licht unter verschiedenen Lichtverhältnissen.	39
de		40
de	Ultraviolett A Licht	41
en	Ultraviolet A light	41
de	Ultraviolettes Licht mit einer Wellenlänge zwischen 315 und 380 nm.	42
en	Ultraviolet light with wavelength between 315 and 380 nm.	42
de		43
en		43
de	Phänomene, die mit der Qualität der Luft zusammenhängen. Zum Beispiel können sie uns sagen, aktualisieren Luftverschmutzung Ebene.	45
de	Phänomene, die mit dem Klima und/oder klimatischen Veränderungen zusammenhängen.	47
de	Bodenphänomene	48
en	Ground phenomena	48
en	The SCD30 from Sensirion is a high quality non-dispersive infrared (NDIR) based CO₂ sensor capable of detecting 400 to 10000ppm with an accuracy of ±(30ppm+3%).	16
en		25
de	Barometric pressure	23
de	SCD30	15
en	SCD30	15
de	Phänomene, die im Boden gemessen werden können.	49
en	Phenomena that can be measured in the ground.	49
de	BME280	50
en	BME280	50
de	Feuchtigkeit	51
en	Humidity	51
en		28
de	VEML6070V2	21
en		34
en	VEML6070V2	21
en	VEML6070 is an advanced ultraviolet (UV) light sensor withI2C protocol interface and designed by the CMOS process.	22
de	Umgebungslicht	38
en	Ambient Light	38
de	LuftdatenInfo Gerät	7
en		40
en	BMP280	11
en	The sensebox:home is a kit for environmental sensing.	2
de	Klimaphänomen	46
en		3
en	senseBox:edu	4
en	The senseBox:edu is a kit for environmental sensing.	5
en		6
de	Luftqualität	44
de	senseBox:edu	4
de	BME680	9
en	Air quality	44
en	The BME680 is a gas sensor that integrates high-linearity and high-accuracy gas, pressure, humidity and temperature sensors.	10
en	Phenomenona that are related to climate and/or climatic changes.	47
en	BME680	9
en	Phenomenona that are related to the quality of air. For instance, they can tell us update air pollution level.	45
en	Climate phenomena	46
en	Ambient light intensity matches the human eye's response to light under a variety of lighting conditions.	39
de	BMP180	52
en	Bosch Sensortec barometric pressure Sensor BMP280 is an absolute barometric pressure sensor especially designed for mobile applications. Also able to measure air temperature.	12
en	LuftdatenInfo Device	7
de	BMP280	11
en	BMP180	52
en	Device to measure air quality.	8
de	Der BMP180 ist die nächste Generation von Sensoren von Bosch und ersetzt den BMP085.	53
de	DHT22	54
en	DHT22	54
de	Digitaler Sensor zur Messung von Temperatur und Luftfeuchtigkeit. Besonders geeignet für Raspberry und Arduino.	55
en	Digital sensor for measuring temperature and humidity. Particularly suitable for Raspberry and Arduino.	55
de	DS18B20	56
en	DS18B20	56
de	Das Digitalthermometer DS18B20 bietet 9-Bit- bis 12-Bit-Celsius-Temperaturmessungen und verfügt über eine Alarmfunktion mit nichtflüchtigen, vom Benutzer programmierbaren oberen und unteren Auslösepunkten. Das DS18B20 kommuniziert über einen 1-Wire-Bus, der per Definition nur eine Datenleitung (und Masse) für die Kommunikation mit einem zentralen Mikroprozessor benötigt. Darüber hinaus kann der DS18B20 direkt über die Datenleitung mit Strom versorgt werden ('parasite power'), so dass eine externe Stromversorgung nicht erforderlich ist.	57
en	The DS18B20 digital thermometer provides 9-bit to 12-bit Celsius temperature measurements and has an alarm function with nonvolatile user-programmable upper and lower trigger points. The DS18B20 communicates over a 1-Wire bus that by definition requires only one data line (and ground) for communication with a central microprocessor. In addition, the DS18B20 can derive power directly from the data line (“parasite power”), eliminating the need for an external power supply.	57
de	DS18S20	58
en	DS18S20	58
de	Temperatur	59
en	Temperature	59
de	HPM	60
en	HPM	60
de	Luftqualität	61
en	Air quality	61
de	HTU21D	62
en	HTU21D	62
de	Feuchtigkeitssensor	63
en	Humidity sensor	63
de	 NEO-6M	64
en	 NEO-6M	64
de	GPS	65
en	GPS	65
de	NO2-A43F	66
en	NO2-A43F	66
de	Gassensor	67
en	Gas sensor	67
de	PMS1003	68
en	PMS1003	68
de	Der PMS 1003 Sensor ist ein neuer laserbasierter Luftqualitätssensor, der von plantower (chinesischer Name: 攀藤 (pānténg)) entwickelt wurde und in zahlreichen Geräten zur Messung der Luftqualität eingesetzt wird.	69
en	The PMS 1003 sensor is a recent laser based air quality sensor developped by plantower (chinese name: 攀藤 (pānténg)) and used inside a numerous number of air quality sensing devices.	69
de	PMS3003	70
en	PMS3003	70
de	Luftqualitätssensor	71
en	Air quality sensor	71
de	PMS5003	72
en	PMS5003	72
de	TODO	73
en	TODO	73
de	PMS6003	74
en	PMS6003	74
de	Luftqualität	75
en	Air quality	75
de	PMS7003	76
en	PMS7003	76
de	Der Sensor nutzt das Prinzip der Laser-Streuung. Es bedeutet, dass das Laserlicht auf die Partikel in der Luft und machen die Streuung, während das Sammeln von Streulicht in einem bestimmten Winkel, was in Streulichtintensität mit der Zeit Kurve.	77
en	The sensor uses the principle of laser scattering. It means that the laser light on the particles in the air and making the scattering, while collecting scattered light at a particular angle , resulting in scattered light intensity with time curve.	77
de	PPD42NS	78
en	PPD42NS	78
de	Luftqualität	79
en	Air quality	79
de	 SBM-19	80
en	 SBM-19	80
de	Strahlung	81
en	Radiation	81
de	 SBM-20	82
en	 SBM-20	82
de	Strahlung	83
en	Radiation	83
de	SDS011	84
en	SDS011	84
de	Partikelsensor	85
en	 Particular matter sensor	85
de	SDS021	86
en	SDS021	86
de	Luftqualität	87
en	Air quality	87
de	SHT10	88
en	SHT10	88
de	Feuchtigkeit	89
en	Humidity	89
de	SHT11	90
en	SHT11	90
de	Feuchtigkeit	91
en	Humidity	91
de	SHT15	92
en	SHT15	92
de	Feuchtigkeit	93
en	Humidity	93
de	SHT30	94
en	SHT30	94
de	Feuchtigkeit	95
en	Humidity	95
de	SHT31	96
en	SHT31	96
de	Temperatur- und Feuchtigkeitssensor	97
en	Temperature and humidity sensor	97
de	SHT35	98
en	SHT35	98
de	Feuchtigkeit	99
en	Humidity	99
de	SHT85	100
en	SHT85	100
de	Der digitale Feuchtesensor SHT85 ist der klassenbeste Feuchtesensor von Sensirion mit einem Stiftstecker für einfache Integration und Austausch.	101
en	The digital humidity sensor SHT85 is Sensirion's best-in-class humidity sensor with a pin-type connector for easy integration and replacement.	101
de	SPS30	102
en	SPS30	102
de	Partikelsensor	103
en	Particulate matter sensor	103
de	Feuchtigkeit	104
en	Humidity	104
de	Eine Größe, die die Menge an Wasserdampf in der Atmosphäre oder in einem Gas angibt.	105
en	A quantity representing the amount of water vapour in the atmosphere or in a gas.	105
de		106
en		106
de	PM2.5	107
en	PM2.5	107
de		108
en		108
de		109
en		109
de	PM10-Konzentration	110
en	PM10 concentration	110
de	Die Konzentration von Partikeln in der Luft.	111
en	The concentration of particles in the air.	111
de		112
en		112
de		113
de	deTest	114
de		115
de		116
de		117
de		118
de		120
de		121
en	The degree Celsius is a unit of temperature on the Celsius scale, a temperature scale originally known as the centigrade scale. The degree Celsius can refer to a specific temperature on the Celsius scale or a unit to indicate a difference or range between two temperatures.	115
en	The pascal is the SI derived unit of pressure used to quantify internal pressure, stress, Young's modulus, and ultimate tensile strength. The unit, named after Blaise Pascal, is defined as one newton per square metre and is equivalent to 10 barye in the CGS system.	116
en	In mathematics, a percentage is a number or ratio expressed as a fraction of 100. It is often denoted using the percent sign, "%", although the abbreviations "pct.", "pct" and sometimes "pc" are also used. A percentage is a dimensionless number; it has no unit of measurement.	117
en	A SI derived unit of density of heat flow rate, irradiance, and radiant energy fluence rate equal to one watt per the unit area of one square meter.	120
en	The Fahrenheit scale is a temperature scale based on one proposed in 1724 by the physicist Daniel Gabriel Fahrenheit. It uses the degree Fahrenheit as the unit.	121
en	The lux is the SI derived unit of illuminance, measuring luminous flux per unit area. It is equal to one lumen per square metre. In photometry, this is used as a measure of the intensity, as perceived by the human eye, of light that hits or passes through a surface.	135
en	Barometric pressure is the pressure within the atmosphere of the Earth. It is also called atmospheric pressure.	24
en	Barometric pressure	23
en	NO2 concentration	123
de	NO2 Konzentration	123
en	The Air Quality Standards Regulations 2010 require that the annual mean concentration of NO2 must not exceed 40 µg/m3 and that there should be no more than 18 exceedances of the hourly mean limit value (concentrations above 200 µg/m3) in a single year.	124
en		125
en	The concentration of an air pollutant (eg. ozone) is given in micrograms (one-millionth of a gram) per cubic meter air or µg/m³.	134
de	Relative Luftfeuchte	26
en	Relative humidity (RH) is the ratio of the partial pressure of water vapor to the equilibrium vapor pressure of water at a given temperature. (Source: Wikipedia)	27
en	Relative humidity	26
en	The millimetre or millimeter is a unit of length in the metric system, equal to one thousandth of a metre, which is the SI base unit of length. Therefore, there are one thousand millimetres in a metre. There are ten millimetres in a centimetre. One millimetre is equal to 1000 micrometres or 1000000 nanometres.	145
de	senseBox:home	1
en	senseBox:home	1
en	The volt is the derived unit for electric potential, electric potential difference, and electromotive force. It is named after the Italian physicist Alessandro Volta.	152
en	Parts per million (ppm) is the number of units of mass of a contaminant per million units of total mass. Source: GreenFacts. More: ppm (or ppm(m)) is used to measure the concentration of a contaminant in soils and sediments. In that case 1 ppm equals 1 mg of substance per kg of solid (mg/kg).	118
en	Voltage	149
en		113
de	Spannung	149
en	Voltage, electric potential difference, electric pressure or electric tension is the difference in electric potential between two points, which (in a static electric field) is defined as the work needed per unit of charge to move a test charge between the two points. In the International System of Units, the derived unit for voltage (potential difference) is named volt.	150
en	Precipitation	139
de	Niederschlag	139
en	In meteorology, precipitation is any product of the condensation of atmospheric water vapor that falls under gravitational pull from clouds.	140
en	Used as a placeholder if a Unit is deleted that is used in "Sensor Elements" or "Range of Values".	114
en	Air temperature	136
de	Lufttemperatur	136
en	The value of air temperature gives the temperature measured in the medium of air.	137
en		138
de	CO2	32
en	CO2	32
en	Carbon dioxide (CO2) is measured in parts-per-million (ppm).	33
en		141
en	Volatile organic compound (VOC)	146
de	Flüchtige organische Verbindungen (FOV)	146
en		147
en	Water Phenomena	142
de	Wasserphänomene	142
en	Phenomena that can be measured in the medium of water.	143
en		148
en		151
en	Sound level	154
de	Lautstärke	154
en	A sound level meter (also called sound pressure level meter (SPL)) is used for acoustic measurements.	155
en		156
en	Water level	157
de	Wasserstand	157
en	Water level, also known as gauge height or stage, is the elevation of the free surface of a sea, stream, lake or reservoir relative to a specified vertical datum.	158
en		159
en	Water temperature	160
de	Wassertemperatur	160
en	The value of water temperature gives the temperature measured in the medium of water.	161
en		162
en	Wind direction	163
de	Windrichtung	163
en	Wind direction is generally reported by the direction from which it originates. For example, a north or northerly wind blows from the north to the south.	164
en		165
en	Wind speed	166
de	Windgeschwindigkeit	166
en	The metre per second is an SI derived unit of both speed (scalar quantity) and velocity (vector quantity (which have direction and magnitude)), equal to the speed of a body covering a distance of one metre in a time of one second. The SI unit symbols are m/s, m·s−1, m s−1, or ms. Sometimes it is abbreviated as "mps".	169
en	In meteorology, wind speed, or wind flow speed, is a fundamental atmospheric quantity caused by air moving from high to low pressure, usually due to changes in temperature. Wind speed is now commonly measured with an anemometer.	167
en		168
en	Light sensor	171
en	AS7262	170
en	This precision sensor from Bosch is the best low-cost sensing solution for measuring barometric pressure and temperature. Because pressure changes with altitude you can also use it as an altimeter! The sensor is soldered onto a PCB with a 3.3V regulator, I2C level shifter and pull-up resistors on the I2C pins.	173
en	BMP085	172
en	The BMP180 is the next-generation of sensors from Bosch, and replaces the BMP085.	53
en	Antenna module	175
en	CSM-M8Q	174
en	The DHT11 is a simple and extremely cost-effective digital temperature and humidity sensor.	177
en	DHT11	176
en	Detects the intensity of light in the environment.	179
en	GL5528	178
en	Grove - Multichannel Gas Sensor provides stable and reliable gases detecting function under the circumstances of any other four sorts of gases. It can detect a variety of gases, besides Carbon monoxide (CO), Nitrogen dioxide (NO2), Ethyl alcohol(C2H5CH), Volatile Organic Compounds (VOC), and etc.	181
en	Grove - Multichannel Gas Sensor	180
en	The HDC1008 temperature and humidity sensor is a I2C digital sensor able to provide accurate measures to 2 decimal places, with excellent response time to the slightest change in temperature or humidity.	183
en	HDC1008	182
en	Air Quality	185
en	HM3301	184
en	Temperature Sensor	187
en	LM35	186
en	Sound Sensor	192
en	LM386	191
en		194
en	MAX4465	193
en	Gas Sensor	198
en	OX-A431	197
en	Optical Rain Gauge RG 15	195
en	This industrial-grade optical rainfall measuring device is intended to replace conventional tipping buckets of rain gauges. It uses beams of infrared light within a plastic lens about the size of a tennis ball.	196
en	Analog Sound Level Meter is a basic instrument for measuring noise or sound level of the surrounding environment.	200
en	SEN0232	199
en	Radiation	202
en	SI22G	201
en	Light Sensor	204
en	TSL2561	203
en	Weather	206
en	TX20	205
\.


--
-- Data for Name: Unit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Unit" (id, slug, name, notation, validation, "descriptionId") FROM stdin;
1	not_specified	Not specified.	N/S	f	114
2	degree_celsius	Degree Celsius	°C	f	115
3	pascal	Pascal	Pa	f	116
4	percent	Percent	%	f	117
5	parts_per_million	Parts per million	ppm	f	118
7	watt_per_square_meter	Watt per square meter	W/m²	f	120
8	degree_fahrenheit	Degree Fahrenheit	°F	f	121
10	microgram_per_cubic_meter	Microgram per cubic meter	µg/m³	f	134
11	lux	Lux	lx	f	135
13	millimeter	Millimeter	mm	f	145
14	volt	Volt	V	f	152
15	meter_per_second	Meter per second	m/s	f	169
\.


--
-- Data for Name: _DeviceToSensor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_DeviceToSensor" ("A", "B") FROM stdin;
1	1
2	1
1	2
2	2
1	3
2	3
1	4
2	4
3	4
1	5
2	5
1	6
2	6
1	7
2	7
3	8
3	9
3	10
3	11
3	12
3	13
3	14
3	15
3	16
3	17
3	18
3	19
3	20
3	21
3	22
3	23
3	24
3	25
3	26
3	27
3	28
3	29
3	30
3	31
3	32
3	33
3	34
3	2
\.


--
-- Data for Name: _DomainToPhenomenon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_DomainToPhenomenon" ("A", "B") FROM stdin;
1	1
1	2
1	3
1	4
1	8
1	10
2	4
3	5
2	6
1	13
2	13
4	14
1	15
1	17
4	18
2	19
4	19
2	20
2	21
\.


--
-- Name: Device_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Device_id_seq"', 3, true);


--
-- Name: Domain_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Domain_id_seq"', 4, true);


--
-- Name: Element_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Element_id_seq"', 18, true);


--
-- Name: Phenomenon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Phenomenon_id_seq"', 22, true);


--
-- Name: RangeOfValues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RangeOfValues_id_seq"', 9, true);


--
-- Name: Sensor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Sensor_id_seq"', 52, true);


--
-- Name: Translation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Translation_id_seq"', 206, true);


--
-- Name: Unit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Unit_id_seq"', 15, true);


--
-- Name: Device Device_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_pkey" PRIMARY KEY (id);


--
-- Name: Domain Domain_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Domain"
    ADD CONSTRAINT "Domain_pkey" PRIMARY KEY (id);


--
-- Name: Element Element_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Element"
    ADD CONSTRAINT "Element_pkey" PRIMARY KEY (id);


--
-- Name: Language Language_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Language"
    ADD CONSTRAINT "Language_pkey" PRIMARY KEY (code);


--
-- Name: Phenomenon Phenomenon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Phenomenon"
    ADD CONSTRAINT "Phenomenon_pkey" PRIMARY KEY (id);


--
-- Name: RangeOfValues RangeOfValues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RangeOfValues"
    ADD CONSTRAINT "RangeOfValues_pkey" PRIMARY KEY (id);


--
-- Name: Sensor Sensor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sensor"
    ADD CONSTRAINT "Sensor_pkey" PRIMARY KEY (id);


--
-- Name: Translation Translation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Translation"
    ADD CONSTRAINT "Translation_pkey" PRIMARY KEY (id);


--
-- Name: Unit Unit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Unit"
    ADD CONSTRAINT "Unit_pkey" PRIMARY KEY (id);


--
-- Name: Device_descriptionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Device_descriptionId_key" ON public."Device" USING btree ("descriptionId");


--
-- Name: Device_labelId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Device_labelId_key" ON public."Device" USING btree ("labelId");


--
-- Name: Device_markdownId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Device_markdownId_key" ON public."Device" USING btree ("markdownId");


--
-- Name: Device_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Device_slug_key" ON public."Device" USING btree (slug);


--
-- Name: Domain_descriptionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Domain_descriptionId_key" ON public."Domain" USING btree ("descriptionId");


--
-- Name: Domain_labelId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Domain_labelId_key" ON public."Domain" USING btree ("labelId");


--
-- Name: Domain_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Domain_slug_key" ON public."Domain" USING btree (slug);


--
-- Name: Phenomenon_descriptionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Phenomenon_descriptionId_key" ON public."Phenomenon" USING btree ("descriptionId");


--
-- Name: Phenomenon_labelId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Phenomenon_labelId_key" ON public."Phenomenon" USING btree ("labelId");


--
-- Name: Phenomenon_markdownId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Phenomenon_markdownId_key" ON public."Phenomenon" USING btree ("markdownId");


--
-- Name: Phenomenon_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Phenomenon_slug_key" ON public."Phenomenon" USING btree (slug);


--
-- Name: Sensor_descriptionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Sensor_descriptionId_key" ON public."Sensor" USING btree ("descriptionId");


--
-- Name: Sensor_labelId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Sensor_labelId_key" ON public."Sensor" USING btree ("labelId");


--
-- Name: Sensor_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Sensor_slug_key" ON public."Sensor" USING btree (slug);


--
-- Name: TranslationItem_translationId_languageCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TranslationItem_translationId_languageCode_key" ON public."TranslationItem" USING btree ("translationId", "languageCode");


--
-- Name: Unit_descriptionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Unit_descriptionId_key" ON public."Unit" USING btree ("descriptionId");


--
-- Name: Unit_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Unit_slug_key" ON public."Unit" USING btree (slug);


--
-- Name: _DeviceToSensor_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_DeviceToSensor_AB_unique" ON public."_DeviceToSensor" USING btree ("A", "B");


--
-- Name: _DeviceToSensor_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_DeviceToSensor_B_index" ON public."_DeviceToSensor" USING btree ("B");


--
-- Name: _DomainToPhenomenon_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_DomainToPhenomenon_AB_unique" ON public."_DomainToPhenomenon" USING btree ("A", "B");


--
-- Name: _DomainToPhenomenon_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_DomainToPhenomenon_B_index" ON public."_DomainToPhenomenon" USING btree ("B");


--
-- Name: Device Device_descriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES public."Translation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Device Device_labelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES public."Translation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Device Device_markdownId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_markdownId_fkey" FOREIGN KEY ("markdownId") REFERENCES public."Translation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Domain Domain_descriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Domain"
    ADD CONSTRAINT "Domain_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES public."Translation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Domain Domain_labelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Domain"
    ADD CONSTRAINT "Domain_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES public."Translation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Element Element_phenomenonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Element"
    ADD CONSTRAINT "Element_phenomenonId_fkey" FOREIGN KEY ("phenomenonId") REFERENCES public."Phenomenon"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Element Element_sensorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Element"
    ADD CONSTRAINT "Element_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES public."Sensor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Element Element_unitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Element"
    ADD CONSTRAINT "Element_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES public."Unit"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Phenomenon Phenomenon_descriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Phenomenon"
    ADD CONSTRAINT "Phenomenon_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES public."Translation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Phenomenon Phenomenon_labelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Phenomenon"
    ADD CONSTRAINT "Phenomenon_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES public."Translation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Phenomenon Phenomenon_markdownId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Phenomenon"
    ADD CONSTRAINT "Phenomenon_markdownId_fkey" FOREIGN KEY ("markdownId") REFERENCES public."Translation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RangeOfValues RangeOfValues_phenomenonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RangeOfValues"
    ADD CONSTRAINT "RangeOfValues_phenomenonId_fkey" FOREIGN KEY ("phenomenonId") REFERENCES public."Phenomenon"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RangeOfValues RangeOfValues_unitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RangeOfValues"
    ADD CONSTRAINT "RangeOfValues_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES public."Unit"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Sensor Sensor_descriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sensor"
    ADD CONSTRAINT "Sensor_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES public."Translation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Sensor Sensor_labelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sensor"
    ADD CONSTRAINT "Sensor_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES public."Translation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TranslationItem TranslationItem_languageCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TranslationItem"
    ADD CONSTRAINT "TranslationItem_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES public."Language"(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TranslationItem TranslationItem_translationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TranslationItem"
    ADD CONSTRAINT "TranslationItem_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES public."Translation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Unit Unit_descriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Unit"
    ADD CONSTRAINT "Unit_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES public."Translation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: _DeviceToSensor _DeviceToSensor_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DeviceToSensor"
    ADD CONSTRAINT "_DeviceToSensor_A_fkey" FOREIGN KEY ("A") REFERENCES public."Device"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DeviceToSensor _DeviceToSensor_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DeviceToSensor"
    ADD CONSTRAINT "_DeviceToSensor_B_fkey" FOREIGN KEY ("B") REFERENCES public."Sensor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DomainToPhenomenon _DomainToPhenomenon_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DomainToPhenomenon"
    ADD CONSTRAINT "_DomainToPhenomenon_A_fkey" FOREIGN KEY ("A") REFERENCES public."Domain"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DomainToPhenomenon _DomainToPhenomenon_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DomainToPhenomenon"
    ADD CONSTRAINT "_DomainToPhenomenon_B_fkey" FOREIGN KEY ("B") REFERENCES public."Phenomenon"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

