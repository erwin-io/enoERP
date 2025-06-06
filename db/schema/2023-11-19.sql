PGDMP     "    
            
    {            emotionalwellnessdb    15.4    15.4 d    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16591    emotionalwellnessdb    DATABASE     �   CREATE DATABASE emotionalwellnessdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
 #   DROP DATABASE emotionalwellnessdb;
                postgres    false                        2615    16592    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            �            1255    16593 -   generate_custom_id(bigint, character varying)    FUNCTION     �   CREATE FUNCTION dbo.generate_custom_id(id bigint, code character varying) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
   SELECT code || TO_CHAR(now(), 'YYYYMMDD') || '_' || id;
$$;
 I   DROP FUNCTION dbo.generate_custom_id(id bigint, code character varying);
       dbo          postgres    false    6                        1255    16594    usp_reset() 	   PROCEDURE     �  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $$
begin

	DELETE FROM dbo."JournalEntryActivity";
	DELETE FROM dbo."JournalEntry";
	DELETE FROM dbo."HeartRateLog";
	DELETE FROM dbo."UserActivityLog";
	DELETE FROM dbo."Notifications";
	DELETE FROM dbo."Messages";
	DELETE FROM dbo."GatewayConnectedUsers";
	DELETE FROM dbo."UserProfilePic";
	DELETE FROM dbo."Users";
	DELETE FROM dbo."Files";
	
	ALTER SEQUENCE dbo."JournalEntryActivity_JournalEntryActivityId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."JournalEntry_JournalEntryId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."HeartRateLog_HeartRateLogId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."UserActivityLog_UserActivityLogId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Files_FileId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."GatewayConnectedUsers_Id_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Messages_MessageId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Migrations_Id_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Notifications_NotificationId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Users_UserId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Files_FileId_seq" RESTART WITH 1;
	
	INSERT INTO dbo."Users" (
		"MobileNumber", 
		"Password", 
		"CurrentHashedRefreshToken", 
		"FirebaseToken", 
		"EntityStatusId",
		"Name", 
		"BirthDate", 
		"Age", 
		"GenderId")
	VALUES (
			'123456',
			'Yzk4M2NlZTI0YWEwMWNkOTM2NGZmMDAyMTkwY2QzYzg=', 
			NULL, 
			NULL,
			1,
			'User1', 
			'1998-07-18', 
			date_part('year',age(cast('1998-07-18' as date))),
			1);
END;
$$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    6            �            1259    16595    ActivityType    TABLE     q   CREATE TABLE dbo."ActivityType" (
    "ActivityTypeId" bigint NOT NULL,
    "Name" character varying NOT NULL
);
    DROP TABLE dbo."ActivityType";
       dbo         heap    postgres    false    6            �            1259    16600    EntityStatus    TABLE     v   CREATE TABLE dbo."EntityStatus" (
    "EntityStatusId" bigint NOT NULL,
    "Name" character varying(100) NOT NULL
);
    DROP TABLE dbo."EntityStatus";
       dbo         heap    postgres    false    6            �            1259    16603    Files    TABLE     i   CREATE TABLE dbo."Files" (
    "FileId" bigint NOT NULL,
    "FileName" text NOT NULL,
    "Url" text
);
    DROP TABLE dbo."Files";
       dbo         heap    postgres    false    6            �            1259    16608    Files_FileId_seq    SEQUENCE     �   ALTER TABLE dbo."Files" ALTER COLUMN "FileId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Files_FileId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    217            �            1259    16609    GatewayConnectedUsers    TABLE     �   CREATE TABLE dbo."GatewayConnectedUsers" (
    "Id" bigint NOT NULL,
    "SocketId" character varying(100) NOT NULL,
    "UserId" bigint NOT NULL
);
 (   DROP TABLE dbo."GatewayConnectedUsers";
       dbo         heap    postgres    false    6            �            1259    16612    GatewayConnectedUsers_Id_seq    SEQUENCE     �   ALTER TABLE dbo."GatewayConnectedUsers" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."GatewayConnectedUsers_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    219    6            �            1259    16613    Gender    TABLE     j   CREATE TABLE dbo."Gender" (
    "GenderId" bigint NOT NULL,
    "Name" character varying(100) NOT NULL
);
    DROP TABLE dbo."Gender";
       dbo         heap    postgres    false    6            �            1259    16616    HeartRateLog    TABLE     �   CREATE TABLE dbo."HeartRateLog" (
    "HeartRateLogId" bigint NOT NULL,
    "Timestamp" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "Value" character varying NOT NULL,
    "UserId" bigint NOT NULL
);
    DROP TABLE dbo."HeartRateLog";
       dbo         heap    postgres    false    6            �            1259    16622    HeartRateLog_HeartRateLogId_seq    SEQUENCE     �   ALTER TABLE dbo."HeartRateLog" ALTER COLUMN "HeartRateLogId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."HeartRateLog_HeartRateLogId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    222    6            �            1259    16623    JournalEntry    TABLE     n  CREATE TABLE dbo."JournalEntry" (
    "JournalEntryId" bigint NOT NULL,
    "Notes" character varying NOT NULL,
    "Timestamp" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "MoodEntityId" bigint NOT NULL,
    "UserId" bigint NOT NULL,
    "EntityStatusId" bigint DEFAULT 1 NOT NULL,
    "HeartRateLogId" bigint NOT NULL
);
    DROP TABLE dbo."JournalEntry";
       dbo         heap    postgres    false    6            �            1259    16630    JournalEntryActivity    TABLE     �   CREATE TABLE dbo."JournalEntryActivity" (
    "JournalEntryActivityId" bigint NOT NULL,
    "JournalEntryId" bigint NOT NULL,
    "ActivityTypeId" bigint NOT NULL
);
 '   DROP TABLE dbo."JournalEntryActivity";
       dbo         heap    postgres    false    6            �            1259    16633 /   JournalEntryActivity_JournalEntryActivityId_seq    SEQUENCE       ALTER TABLE dbo."JournalEntryActivity" ALTER COLUMN "JournalEntryActivityId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."JournalEntryActivity_JournalEntryActivityId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    225            �            1259    16634    JournalEntry_JournalEntryId_seq    SEQUENCE     �   ALTER TABLE dbo."JournalEntry" ALTER COLUMN "JournalEntryId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."JournalEntry_JournalEntryId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    224    6            �            1259    16635    Messages    TABLE       CREATE TABLE dbo."Messages" (
    "MessageId" bigint NOT NULL,
    "Message" text NOT NULL,
    "FromUserId" bigint NOT NULL,
    "ToUserId" bigint NOT NULL,
    "DateTime" timestamp without time zone NOT NULL,
    "IsCustomer" boolean DEFAULT false NOT NULL
);
    DROP TABLE dbo."Messages";
       dbo         heap    postgres    false    6            �            1259    16641    Messages_MessageId_seq    SEQUENCE     �   ALTER TABLE dbo."Messages" ALTER COLUMN "MessageId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Messages_MessageId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    228    6            �            1259    16642 
   Migrations    TABLE     �   CREATE TABLE dbo."Migrations" (
    "Id" integer NOT NULL,
    "Timestamp" bigint NOT NULL,
    "Name" character varying(255) NOT NULL
);
    DROP TABLE dbo."Migrations";
       dbo         heap    postgres    false    6            �            1259    16645    Migrations_Id_seq    SEQUENCE     �   ALTER TABLE dbo."Migrations" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Migrations_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    230    6            �            1259    16646 
   MoodEntity    TABLE     m   CREATE TABLE dbo."MoodEntity" (
    "MoodEntityId" bigint NOT NULL,
    "Name" character varying NOT NULL
);
    DROP TABLE dbo."MoodEntity";
       dbo         heap    postgres    false    6            �            1259    16651    NotificationType    TABLE     y   CREATE TABLE dbo."NotificationType" (
    "NotificationTypeId" bigint NOT NULL,
    "Name" character varying NOT NULL
);
 #   DROP TABLE dbo."NotificationType";
       dbo         heap    postgres    false    6            �            1259    16656    Notifications    TABLE     �  CREATE TABLE dbo."Notifications" (
    "NotificationId" bigint NOT NULL,
    "Date" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "UserId" bigint NOT NULL,
    "Title" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "EntityStatusId" bigint DEFAULT 1 NOT NULL,
    "IsRead" boolean DEFAULT false NOT NULL,
    "NotificationTypeId" bigint NOT NULL
);
     DROP TABLE dbo."Notifications";
       dbo         heap    postgres    false    6            �            1259    16664     Notifications_NotificationId_seq    SEQUENCE     �   ALTER TABLE dbo."Notifications" ALTER COLUMN "NotificationId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Notifications_NotificationId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    234            �            1259    16665    PetCompanion    TABLE     q   CREATE TABLE dbo."PetCompanion" (
    "PetCompanionId" bigint NOT NULL,
    "Name" character varying NOT NULL
);
    DROP TABLE dbo."PetCompanion";
       dbo         heap    postgres    false    6            �            1259    16670    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    6            �            1259    16675    UserActivityLog    TABLE     K  CREATE TABLE dbo."UserActivityLog" (
    "UserActivityLogId" bigint NOT NULL,
    "UserActivityTypeId" bigint NOT NULL,
    "UserId" bigint NOT NULL,
    "Date" timestamp with time zone NOT NULL,
    "OS" character varying NOT NULL,
    "OSVersion" character varying DEFAULT 0 NOT NULL,
    "Browser" character varying NOT NULL
);
 "   DROP TABLE dbo."UserActivityLog";
       dbo         heap    postgres    false    6            �            1259    16681 %   UserActivityLog_UserActivityLogId_seq    SEQUENCE     �   ALTER TABLE dbo."UserActivityLog" ALTER COLUMN "UserActivityLogId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."UserActivityLog_UserActivityLogId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    238            �            1259    16682    UserActivityType    TABLE     y   CREATE TABLE dbo."UserActivityType" (
    "UserActivityTypeId" bigint NOT NULL,
    "Name" character varying NOT NULL
);
 #   DROP TABLE dbo."UserActivityType";
       dbo         heap    postgres    false    6            �            1259    16687    UserProfilePic    TABLE     b   CREATE TABLE dbo."UserProfilePic" (
    "UserId" bigint NOT NULL,
    "FileId" bigint NOT NULL
);
 !   DROP TABLE dbo."UserProfilePic";
       dbo         heap    postgres    false    6            �            1259    16690    Users    TABLE     �  CREATE TABLE dbo."Users" (
    "UserId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "MobileNumber" character varying NOT NULL,
    "BirthDate" date NOT NULL,
    "Age" bigint NOT NULL,
    "GenderId" bigint NOT NULL,
    "Password" character varying NOT NULL,
    "CurrentHashedRefreshToken" text,
    "FirebaseToken" text,
    "EntityStatusId" bigint NOT NULL,
    "Expire" timestamp with time zone DEFAULT ((now() AT TIME ZONE 'Asia/Manila'::text) + '06:00:00'::interval) NOT NULL,
    "LastJournalEntry" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "PetCompanionId" bigint DEFAULT 1 NOT NULL
);
    DROP TABLE dbo."Users";
       dbo         heap    postgres    false    6            �            1259    16698    Users_UserId_seq    SEQUENCE     �   ALTER TABLE dbo."Users" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    242            �          0    16595    ActivityType 
   TABLE DATA           ?   COPY dbo."ActivityType" ("ActivityTypeId", "Name") FROM stdin;
    dbo          postgres    false    215   
�       �          0    16600    EntityStatus 
   TABLE DATA           ?   COPY dbo."EntityStatus" ("EntityStatusId", "Name") FROM stdin;
    dbo          postgres    false    216   =�       �          0    16603    Files 
   TABLE DATA           ;   COPY dbo."Files" ("FileId", "FileName", "Url") FROM stdin;
    dbo          postgres    false    217   m�       �          0    16609    GatewayConnectedUsers 
   TABLE DATA           J   COPY dbo."GatewayConnectedUsers" ("Id", "SocketId", "UserId") FROM stdin;
    dbo          postgres    false    219   ��       �          0    16613    Gender 
   TABLE DATA           3   COPY dbo."Gender" ("GenderId", "Name") FROM stdin;
    dbo          postgres    false    221   ��       �          0    16616    HeartRateLog 
   TABLE DATA           W   COPY dbo."HeartRateLog" ("HeartRateLogId", "Timestamp", "Value", "UserId") FROM stdin;
    dbo          postgres    false    222   �       �          0    16623    JournalEntry 
   TABLE DATA           �   COPY dbo."JournalEntry" ("JournalEntryId", "Notes", "Timestamp", "MoodEntityId", "UserId", "EntityStatusId", "HeartRateLogId") FROM stdin;
    dbo          postgres    false    224   ��       �          0    16630    JournalEntryActivity 
   TABLE DATA           k   COPY dbo."JournalEntryActivity" ("JournalEntryActivityId", "JournalEntryId", "ActivityTypeId") FROM stdin;
    dbo          postgres    false    225   �       �          0    16635    Messages 
   TABLE DATA           m   COPY dbo."Messages" ("MessageId", "Message", "FromUserId", "ToUserId", "DateTime", "IsCustomer") FROM stdin;
    dbo          postgres    false    228   9�       �          0    16642 
   Migrations 
   TABLE DATA           >   COPY dbo."Migrations" ("Id", "Timestamp", "Name") FROM stdin;
    dbo          postgres    false    230   V�       �          0    16646 
   MoodEntity 
   TABLE DATA           ;   COPY dbo."MoodEntity" ("MoodEntityId", "Name") FROM stdin;
    dbo          postgres    false    232   s�       �          0    16651    NotificationType 
   TABLE DATA           G   COPY dbo."NotificationType" ("NotificationTypeId", "Name") FROM stdin;
    dbo          postgres    false    233          �          0    16656    Notifications 
   TABLE DATA           �   COPY dbo."Notifications" ("NotificationId", "Date", "UserId", "Title", "Description", "EntityStatusId", "IsRead", "NotificationTypeId") FROM stdin;
    dbo          postgres    false    234   ��       �          0    16665    PetCompanion 
   TABLE DATA           ?   COPY dbo."PetCompanion" ("PetCompanionId", "Name") FROM stdin;
    dbo          postgres    false    236   �       �          0    16670    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    237   I�       �          0    16675    UserActivityLog 
   TABLE DATA           �   COPY dbo."UserActivityLog" ("UserActivityLogId", "UserActivityTypeId", "UserId", "Date", "OS", "OSVersion", "Browser") FROM stdin;
    dbo          postgres    false    238   �       �          0    16682    UserActivityType 
   TABLE DATA           G   COPY dbo."UserActivityType" ("UserActivityTypeId", "Name") FROM stdin;
    dbo          postgres    false    240   *�       �          0    16687    UserProfilePic 
   TABLE DATA           ;   COPY dbo."UserProfilePic" ("UserId", "FileId") FROM stdin;
    dbo          postgres    false    241   Z�       �          0    16690    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "Name", "MobileNumber", "BirthDate", "Age", "GenderId", "Password", "CurrentHashedRefreshToken", "FirebaseToken", "EntityStatusId", "Expire", "LastJournalEntry", "PetCompanionId") FROM stdin;
    dbo          postgres    false    242   w�       �           0    0    Files_FileId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Files_FileId_seq"', 1, false);
          dbo          postgres    false    218            �           0    0    GatewayConnectedUsers_Id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('dbo."GatewayConnectedUsers_Id_seq"', 1, false);
          dbo          postgres    false    220            �           0    0    HeartRateLog_HeartRateLogId_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('dbo."HeartRateLog_HeartRateLogId_seq"', 1, false);
          dbo          postgres    false    223            �           0    0 /   JournalEntryActivity_JournalEntryActivityId_seq    SEQUENCE SET     ]   SELECT pg_catalog.setval('dbo."JournalEntryActivity_JournalEntryActivityId_seq"', 1, false);
          dbo          postgres    false    226            �           0    0    JournalEntry_JournalEntryId_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('dbo."JournalEntry_JournalEntryId_seq"', 1, false);
          dbo          postgres    false    227            �           0    0    Messages_MessageId_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('dbo."Messages_MessageId_seq"', 1, false);
          dbo          postgres    false    229            �           0    0    Migrations_Id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('dbo."Migrations_Id_seq"', 1, false);
          dbo          postgres    false    231            �           0    0     Notifications_NotificationId_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('dbo."Notifications_NotificationId_seq"', 1, false);
          dbo          postgres    false    235            �           0    0 %   UserActivityLog_UserActivityLogId_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('dbo."UserActivityLog_UserActivityLogId_seq"', 1, false);
          dbo          postgres    false    239            �           0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 1, true);
          dbo          postgres    false    243            �           2606    16700    ActivityType ActivityType_pkey1 
   CONSTRAINT     l   ALTER TABLE ONLY dbo."ActivityType"
    ADD CONSTRAINT "ActivityType_pkey1" PRIMARY KEY ("ActivityTypeId");
 J   ALTER TABLE ONLY dbo."ActivityType" DROP CONSTRAINT "ActivityType_pkey1";
       dbo            postgres    false    215            �           2606    16702    HeartRateLog HeartRateLog_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."HeartRateLog"
    ADD CONSTRAINT "HeartRateLog_pkey" PRIMARY KEY ("HeartRateLogId");
 I   ALTER TABLE ONLY dbo."HeartRateLog" DROP CONSTRAINT "HeartRateLog_pkey";
       dbo            postgres    false    222            �           2606    16704    JournalEntry JournalEntry_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."JournalEntry"
    ADD CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("JournalEntryId");
 I   ALTER TABLE ONLY dbo."JournalEntry" DROP CONSTRAINT "JournalEntry_pkey";
       dbo            postgres    false    224            �           2606    16706    MoodEntity MoodEntity_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY dbo."MoodEntity"
    ADD CONSTRAINT "MoodEntity_pkey" PRIMARY KEY ("MoodEntityId");
 E   ALTER TABLE ONLY dbo."MoodEntity" DROP CONSTRAINT "MoodEntity_pkey";
       dbo            postgres    false    232            �           2606    16708 &   NotificationType NotificationType_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY dbo."NotificationType"
    ADD CONSTRAINT "NotificationType_pkey" PRIMARY KEY ("NotificationTypeId");
 Q   ALTER TABLE ONLY dbo."NotificationType" DROP CONSTRAINT "NotificationType_pkey";
       dbo            postgres    false    233            �           2606    16710    PetCompanion PetCompanion_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."PetCompanion"
    ADD CONSTRAINT "PetCompanion_pkey" PRIMARY KEY ("PetCompanionId");
 I   ALTER TABLE ONLY dbo."PetCompanion" DROP CONSTRAINT "PetCompanion_pkey";
       dbo            postgres    false    236            �           2606    16712    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    237            �           2606    16714 &   UserActivityType UserActivityType_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY dbo."UserActivityType"
    ADD CONSTRAINT "UserActivityType_pkey" PRIMARY KEY ("UserActivityTypeId");
 Q   ALTER TABLE ONLY dbo."UserActivityType" DROP CONSTRAINT "UserActivityType_pkey";
       dbo            postgres    false    240            �           2606    16716 4   Migrations pk_8c82d7f526340ab734260ea46be_1029578706 
   CONSTRAINT     s   ALTER TABLE ONLY dbo."Migrations"
    ADD CONSTRAINT pk_8c82d7f526340ab734260ea46be_1029578706 PRIMARY KEY ("Id");
 ]   ALTER TABLE ONLY dbo."Migrations" DROP CONSTRAINT pk_8c82d7f526340ab734260ea46be_1029578706;
       dbo            postgres    false    230            �           2606    16718 &   EntityStatus pk_entitystatus_869578136 
   CONSTRAINT     q   ALTER TABLE ONLY dbo."EntityStatus"
    ADD CONSTRAINT pk_entitystatus_869578136 PRIMARY KEY ("EntityStatusId");
 O   ALTER TABLE ONLY dbo."EntityStatus" DROP CONSTRAINT pk_entitystatus_869578136;
       dbo            postgres    false    216            �           2606    16720    Files pk_files_901578250 
   CONSTRAINT     [   ALTER TABLE ONLY dbo."Files"
    ADD CONSTRAINT pk_files_901578250 PRIMARY KEY ("FileId");
 A   ALTER TABLE ONLY dbo."Files" DROP CONSTRAINT pk_files_901578250;
       dbo            postgres    false    217            �           2606    16722 8   GatewayConnectedUsers pk_gatewayconnectedusers_933578364 
   CONSTRAINT     w   ALTER TABLE ONLY dbo."GatewayConnectedUsers"
    ADD CONSTRAINT pk_gatewayconnectedusers_933578364 PRIMARY KEY ("Id");
 a   ALTER TABLE ONLY dbo."GatewayConnectedUsers" DROP CONSTRAINT pk_gatewayconnectedusers_933578364;
       dbo            postgres    false    219            �           2606    16724    Gender pk_gender_965578478 
   CONSTRAINT     _   ALTER TABLE ONLY dbo."Gender"
    ADD CONSTRAINT pk_gender_965578478 PRIMARY KEY ("GenderId");
 C   ALTER TABLE ONLY dbo."Gender" DROP CONSTRAINT pk_gender_965578478;
       dbo            postgres    false    221            �           2606    16726    Messages pk_messages_997578592 
   CONSTRAINT     d   ALTER TABLE ONLY dbo."Messages"
    ADD CONSTRAINT pk_messages_997578592 PRIMARY KEY ("MessageId");
 G   ALTER TABLE ONLY dbo."Messages" DROP CONSTRAINT pk_messages_997578592;
       dbo            postgres    false    228            �           2606    16728 )   Notifications pk_notifications_1061578820 
   CONSTRAINT     t   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT pk_notifications_1061578820 PRIMARY KEY ("NotificationId");
 R   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT pk_notifications_1061578820;
       dbo            postgres    false    234            �           2606    16730 "   UserActivityLog pk_useractivitylog 
   CONSTRAINT     p   ALTER TABLE ONLY dbo."UserActivityLog"
    ADD CONSTRAINT pk_useractivitylog PRIMARY KEY ("UserActivityLogId");
 K   ALTER TABLE ONLY dbo."UserActivityLog" DROP CONSTRAINT pk_useractivitylog;
       dbo            postgres    false    238            �           2606    16732 -   UserProfilePic pk_userprofilepic_1_1525580473 
   CONSTRAINT     p   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT pk_userprofilepic_1_1525580473 PRIMARY KEY ("UserId");
 V   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT pk_userprofilepic_1_1525580473;
       dbo            postgres    false    241            �           2606    16734    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    242            �           2606    16735 3   GatewayConnectedUsers fk_GatewayConnectedUsers_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GatewayConnectedUsers"
    ADD CONSTRAINT "fk_GatewayConnectedUsers_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 ^   ALTER TABLE ONLY dbo."GatewayConnectedUsers" DROP CONSTRAINT "fk_GatewayConnectedUsers_User";
       dbo          postgres    false    3303    219    242            �           2606    16740 !   HeartRateLog fk_HeartRateLog_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."HeartRateLog"
    ADD CONSTRAINT "fk_HeartRateLog_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 L   ALTER TABLE ONLY dbo."HeartRateLog" DROP CONSTRAINT "fk_HeartRateLog_User";
       dbo          postgres    false    222    242    3303            �           2606    16745 9   JournalEntryActivity fk_JournalEntryActivity_ActivityType    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."JournalEntryActivity"
    ADD CONSTRAINT "fk_JournalEntryActivity_ActivityType" FOREIGN KEY ("ActivityTypeId") REFERENCES dbo."ActivityType"("ActivityTypeId");
 d   ALTER TABLE ONLY dbo."JournalEntryActivity" DROP CONSTRAINT "fk_JournalEntryActivity_ActivityType";
       dbo          postgres    false    225    3269    215            �           2606    16750 )   JournalEntry fk_JournalEntry_EntityStatus    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."JournalEntry"
    ADD CONSTRAINT "fk_JournalEntry_EntityStatus" FOREIGN KEY ("EntityStatusId") REFERENCES dbo."EntityStatus"("EntityStatusId");
 T   ALTER TABLE ONLY dbo."JournalEntry" DROP CONSTRAINT "fk_JournalEntry_EntityStatus";
       dbo          postgres    false    216    224    3271            �           2606    16755 )   JournalEntry fk_JournalEntry_HeartRateLog    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."JournalEntry"
    ADD CONSTRAINT "fk_JournalEntry_HeartRateLog" FOREIGN KEY ("HeartRateLogId") REFERENCES dbo."HeartRateLog"("HeartRateLogId") NOT VALID;
 T   ALTER TABLE ONLY dbo."JournalEntry" DROP CONSTRAINT "fk_JournalEntry_HeartRateLog";
       dbo          postgres    false    224    3279    222            �           2606    16760 '   JournalEntry fk_JournalEntry_MoodEntity    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."JournalEntry"
    ADD CONSTRAINT "fk_JournalEntry_MoodEntity" FOREIGN KEY ("MoodEntityId") REFERENCES dbo."MoodEntity"("MoodEntityId");
 R   ALTER TABLE ONLY dbo."JournalEntry" DROP CONSTRAINT "fk_JournalEntry_MoodEntity";
       dbo          postgres    false    224    3287    232            �           2606    16765 !   JournalEntry fk_JournalEntry_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."JournalEntry"
    ADD CONSTRAINT "fk_JournalEntry_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 L   ALTER TABLE ONLY dbo."JournalEntry" DROP CONSTRAINT "fk_JournalEntry_User";
       dbo          postgres    false    224    242    3303            �           2606    16770    Users fk_PetCompanion_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT "fk_PetCompanion_User" FOREIGN KEY ("PetCompanionId") REFERENCES dbo."PetCompanion"("PetCompanionId") NOT VALID;
 E   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT "fk_PetCompanion_User";
       dbo          postgres    false    3293    236    242            �           2606    16775 3   UserActivityLog fk_UserActivityLog_UserActivityType    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserActivityLog"
    ADD CONSTRAINT "fk_UserActivityLog_UserActivityType" FOREIGN KEY ("UserActivityTypeId") REFERENCES dbo."UserActivityType"("UserActivityTypeId") NOT VALID;
 ^   ALTER TABLE ONLY dbo."UserActivityLog" DROP CONSTRAINT "fk_UserActivityLog_UserActivityType";
       dbo          postgres    false    238    3299    240            �           2606    16780 (   UserActivityLog fk_UserActivityLog_Users    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserActivityLog"
    ADD CONSTRAINT "fk_UserActivityLog_Users" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 S   ALTER TABLE ONLY dbo."UserActivityLog" DROP CONSTRAINT "fk_UserActivityLog_Users";
       dbo          postgres    false    238    242    3303            �           2606    16785 +   Notifications fk_notifications_entitystatus    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT fk_notifications_entitystatus FOREIGN KEY ("EntityStatusId") REFERENCES dbo."EntityStatus"("EntityStatusId") NOT VALID;
 T   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT fk_notifications_entitystatus;
       dbo          postgres    false    216    3271    234            �           2606    16790 /   Notifications fk_notifications_notificationType    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT "fk_notifications_notificationType" FOREIGN KEY ("NotificationTypeId") REFERENCES dbo."NotificationType"("NotificationTypeId") NOT VALID;
 Z   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT "fk_notifications_notificationType";
       dbo          postgres    false    233    234    3289            �           2606    16795 $   Notifications fk_notifications_users    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT fk_notifications_users FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 M   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT fk_notifications_users;
       dbo          postgres    false    234    3303    242            �           2606    16800 0   UserProfilePic fk_userprofilepic_files_354100302    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT fk_userprofilepic_files_354100302 FOREIGN KEY ("FileId") REFERENCES dbo."Files"("FileId");
 Y   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT fk_userprofilepic_files_354100302;
       dbo          postgres    false    241    3273    217            �           2606    16805 &   UserProfilePic fk_userprofilepic_users    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT fk_userprofilepic_users FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 O   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT fk_userprofilepic_users;
       dbo          postgres    false    3303    242    241            �           2606    16810 %   Users fk_users_entitystatus_386100416    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT fk_users_entitystatus_386100416 FOREIGN KEY ("EntityStatusId") REFERENCES dbo."EntityStatus"("EntityStatusId");
 N   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT fk_users_entitystatus_386100416;
       dbo          postgres    false    242    3271    216            �           2606    16815    Users fk_users_gender    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT fk_users_gender FOREIGN KEY ("GenderId") REFERENCES dbo."Gender"("GenderId") NOT VALID;
 >   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT fk_users_gender;
       dbo          postgres    false    221    242    3277            �   #   x�3�t�H-J�,N�2�tK����̩����� sR�      �       x�3�tI�I-IM�2�tL.�,K����� UrE      �      x������ � �      �      x������ � �      �   +   x�3�J,�H-R��/Q(N��2�tK�M�I�2��Q1z\\\ ��
�      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   ?   x�3��T�UH��O�2�t�M���K�2�t�K/��2�tKM��(d$Tr���ŉ)\1z\\\ ]��      �   *   x�3��HM,*Q(J,I�2���/-�K�Qp�+)������ �6	�      �      x������ � �      �       x�3�t�r�2�tv�2�t�w����� 9�K      �   �   x�u��
�@���SL�n�['ɅS�ֺ���뮸k��gt	����03�,i�Y.�P�����e�A]c*��o0�]�'�����)��dG��Af�1���6�R��p��Q���	Z9������j	nޢ��l�Ac�o�������}wR7o[�V�o�Trq�`î+���7Q      �      x������ � �      �       x�3�-N-R��O���2�s�KK�b���� ��	#      �      x������ � �      �   �   x�eͻ�0@�<����o�6��%XMF �/Xŷ���899�TW� e#>F���!�Q� ��`����,�.!�׳�VOSn�2�py�d��e�n��K_~�zz̴q�e�^�o��h���U�.�{?a��И�\t~۲�"���Ϟ� Ȁx�Âr�Đ��?+ǖe��9�     