PGDMP         1            
    {            enoerp    15.4    15.4                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                        0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            !           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            "           1262    16875    enoerp    DATABASE     �   CREATE DATABASE enoerp WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE enoerp;
                postgres    false                        2615    16876    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            �            1255    16877    usp_reset() 	   PROCEDURE     �  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

	DELETE FROM dbo."ItemCategory";
	DELETE FROM dbo."Users";
	DELETE FROM dbo."Access";
	
	ALTER SEQUENCE dbo."ItemCategory_ItemCategoryId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Users_UserId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Access_AccessId_seq" RESTART WITH 1;
	
	INSERT INTO dbo."Access" (
		"Name", 
		"Active",
		"AccessPages"
	)
	VALUES (
			'Admin',
			true,
			'[
      {
        "page": "Dashboard",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Users",
        "view": false,
        "modify": false,
        "rights": []
      },
      {
        "page": "Access",
        "view": false,
        "modify": false,
        "rights": []
      }
    ]');
	
	INSERT INTO dbo."Users" (
		"UserName",
		"Password", 
		"FullName",
		"Gender",
		"BirthDate",
		"MobileNumber",
		"Email",
		"AccessGranted",
		"AccessId")
	VALUES (
			'admin',
			'$2b$10$LqN3kzfgaYnP5PfDZFfT4edUFqh5Lu7amIxeDDDmu/KEqQFze.p8a',  
			'FullName',
			'GENDER',
			'1998-07-18',
			'123456',
			'email@gmail.com',
			true,
			1);
	
END;
$_$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    6            �            1259    17005    Access    TABLE     �   CREATE TABLE dbo."Access" (
    "AccessId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "AccessPages" json DEFAULT '[]'::json NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."Access";
       dbo         heap    postgres    false    6            �            1259    17004    Access_AccessId_seq    SEQUENCE     �   ALTER TABLE dbo."Access" ALTER COLUMN "AccessId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Access_AccessId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    219    6            �            1259    17016    ItemCategory    TABLE     �   CREATE TABLE dbo."ItemCategory" (
    "ItemCategoryId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."ItemCategory";
       dbo         heap    postgres    false    6            �            1259    17015    ItemCategory_ItemCategoryId_seq    SEQUENCE     �   ALTER TABLE dbo."ItemCategory" ALTER COLUMN "ItemCategoryId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."ItemCategory_ItemCategoryId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    221    6            �            1259    16931    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    6            �            1259    16936    Users    TABLE     T  CREATE TABLE dbo."Users" (
    "UserId" bigint NOT NULL,
    "UserName" character varying NOT NULL,
    "Password" character varying NOT NULL,
    "FullName" character varying NOT NULL,
    "Gender" character varying DEFAULT 'Others'::character varying NOT NULL,
    "BirthDate" date NOT NULL,
    "MobileNumber" character varying NOT NULL,
    "Email" character varying NOT NULL,
    "AccessGranted" boolean NOT NULL,
    "AccessId" bigint,
    "Active" boolean DEFAULT true NOT NULL,
    "UserCode" character varying,
    "Address" character varying DEFAULT 'NA'::character varying NOT NULL
);
    DROP TABLE dbo."Users";
       dbo         heap    postgres    false    6            �            1259    16944    Users_UserId_seq    SEQUENCE     �   ALTER TABLE dbo."Users" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    216                      0    17005    Access 
   TABLE DATA           L   COPY dbo."Access" ("AccessId", "Name", "AccessPages", "Active") FROM stdin;
    dbo          postgres    false    219   *&                 0    17016    ItemCategory 
   TABLE DATA           X   COPY dbo."ItemCategory" ("ItemCategoryId", "Name", "Description", "Active") FROM stdin;
    dbo          postgres    false    221   �&                 0    16931    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    215   �&                 0    16936    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "UserName", "Password", "FullName", "Gender", "BirthDate", "MobileNumber", "Email", "AccessGranted", "AccessId", "Active", "UserCode", "Address") FROM stdin;
    dbo          postgres    false    216   �&       #           0    0    Access_AccessId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Access_AccessId_seq"', 1, true);
          dbo          postgres    false    218            $           0    0    ItemCategory_ItemCategoryId_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('dbo."ItemCategory_ItemCategoryId_seq"', 1, false);
          dbo          postgres    false    220            %           0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 1, true);
          dbo          postgres    false    217            �           2606    17013    Access Access_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Access"
    ADD CONSTRAINT "Access_pkey" PRIMARY KEY ("AccessId");
 =   ALTER TABLE ONLY dbo."Access" DROP CONSTRAINT "Access_pkey";
       dbo            postgres    false    219            �           2606    17023    ItemCategory ItemCategory_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."ItemCategory"
    ADD CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("ItemCategoryId");
 I   ALTER TABLE ONLY dbo."ItemCategory" DROP CONSTRAINT "ItemCategory_pkey";
       dbo            postgres    false    221            |           2606    16956    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    215            ~           2606    16960    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    216            �           1259    17045    u_itemcategory    INDEX     �   CREATE UNIQUE INDEX u_itemcategory ON dbo."ItemCategory" USING btree ("Name", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_itemcategory;
       dbo            postgres    false    221    221    221                       1259    17040    u_user    INDEX     �   CREATE UNIQUE INDEX u_user ON dbo."Users" USING btree ("UserName", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_user;
       dbo            postgres    false    216    216    216            �           1259    17042    u_user_email    INDEX     �   CREATE UNIQUE INDEX u_user_email ON dbo."Users" USING btree ("Email", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_user_email;
       dbo            postgres    false    216    216    216            �           1259    17041    u_user_number    INDEX     �   CREATE UNIQUE INDEX u_user_number ON dbo."Users" USING btree ("MobileNumber", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_user_number;
       dbo            postgres    false    216    216    216            �           2606    17032    Users fk_User_Access    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT "fk_User_Access" FOREIGN KEY ("AccessId") REFERENCES dbo."Access"("AccessId") NOT VALID;
 ?   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT "fk_User_Access";
       dbo          postgres    false    3203    219    216               y   x�3�tL���㌎�S �jCAA� 1=U�JA�%�8#)?�(EII�,3�([RT��,�����V�E�(3=��(���gmhqjQ16+�s��ۉ!C����ɩŴ��,����� ��`%            x������ � �            x������ � �         �   x����  ���sp�D%�V�Z�Y�C�%�,�ؚO_�����8ή���	*�v��e��i���O2�YK���9�q�a/gC^��S����h]WIZ&���[��zt��?�==���t
�u!��&�     