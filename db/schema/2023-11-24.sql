PGDMP         9            
    {            enoerp    15.4    15.4 j    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16875    enoerp    DATABASE     �   CREATE DATABASE enoerp WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE enoerp;
                postgres    false                        2615    16876    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            �            1255    16877    usp_reset() 	   PROCEDURE     Q	  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

	DELETE FROM dbo."GoodsIssueItem";
	DELETE FROM dbo."GoodsIssue";
	DELETE FROM dbo."GoodsReceiptItem";
	DELETE FROM dbo."GoodsReceipt";
	DELETE FROM dbo."InventoryRequestItem";
	DELETE FROM dbo."InventoryRequest";
	DELETE FROM dbo."InventoryRequestRate";
	DELETE FROM dbo."Users";
	DELETE FROM dbo."Access";
	DELETE FROM dbo."ItemBranch";
	DELETE FROM dbo."ItemWarehouse";
	DELETE FROM dbo."Item";
	DELETE FROM dbo."ItemCategory";
	DELETE FROM dbo."Warehouse";
	DELETE FROM dbo."Branch";
	
	ALTER SEQUENCE dbo."GoodsIssue_GoodsIssueId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."GoodsReceipt_GoodsReceiptId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."InventoryRequest_InventoryRequestId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."InventoryRequestRate_InventoryRequestRateId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Users_UserId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Access_AccessId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Item_ItemId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."ItemCategory_ItemCategoryId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Warehouse_WarehouseId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Branch_BranchId_seq" RESTART WITH 1;
	
	INSERT INTO dbo."Branch" (
		"BranchCode", 
		"Name", 
		"IsMainBranch"
	)
	VALUES (
			'MAINBRANCH',
			'MAINBRANCH',
			true);
	INSERT INTO dbo."Warehouse" (
		"WarehouseCode", 
		"Name", 
		"Active"
	)
	VALUES (
			'DEFAULT_WAREHOUSE',
			'DEFAULT_WAREHOUSE',
			true);
	
	INSERT INTO dbo."Access" (
		"AccessCode",
		"Name", 
		"Active",
		"AccessPages"
	)
	VALUES (
			'000001',
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
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Access",
        "view": true,
        "modify": true,
        "rights": []
      }
    ]');
	
	INSERT INTO dbo."Users" (
		"UserCode",
		"UserName",
		"Password", 
		"FullName",
		"Gender",
		"BirthDate",
		"MobileNumber",
		"Email",
		"AccessGranted",
		"AccessId",
		"BranchId")
	VALUES (
			'000001',
			'admin',
			'$2b$10$LqN3kzfgaYnP5PfDZFfT4edUFqh5Lu7amIxeDDDmu/KEqQFze.p8a',  
			'Admin Admin',
			'GENDER',
			'1998-07-18',
			'123456',
			'email@gmail.com',
			true,
			1,
			1);
	
END;
$_$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    6            �            1259    17005    Access    TABLE     �   CREATE TABLE dbo."Access" (
    "AccessId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "AccessPages" json DEFAULT '[]'::json NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "AccessCode" character varying
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
            dbo          postgres    false    6    219            �            1259    17130    Branch    TABLE     �   CREATE TABLE dbo."Branch" (
    "BranchId" bigint NOT NULL,
    "BranchCode" character varying NOT NULL,
    "Name" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "IsMainBranch" boolean DEFAULT false NOT NULL
);
    DROP TABLE dbo."Branch";
       dbo         heap    postgres    false    6            �            1259    17129    Branch_BranchId_seq    SEQUENCE     �   ALTER TABLE dbo."Branch" ALTER COLUMN "BranchId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Branch_BranchId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    228    6            �            1259    17381 
   GoodsIssue    TABLE     +  CREATE TABLE dbo."GoodsIssue" (
    "GoodsIssueId" bigint NOT NULL,
    "GoodsIssueCode" character varying NOT NULL,
    "WarehouseId" bigint NOT NULL,
    "Description" character varying NOT NULL,
    "IssueType" character varying NOT NULL,
    "CreatedByUserId" bigint NOT NULL,
    "DateCreated" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateLastUpdated" timestamp with time zone,
    "Status" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."GoodsIssue";
       dbo         heap    postgres    false    6            �            1259    17401    GoodsIssueItem    TABLE     �   CREATE TABLE dbo."GoodsIssueItem" (
    "GoodsIssueId" bigint NOT NULL,
    "ItemId" bigint NOT NULL,
    "Quantity" numeric DEFAULT 0 NOT NULL
);
 !   DROP TABLE dbo."GoodsIssueItem";
       dbo         heap    postgres    false    6            �            1259    17380    GoodsIssue_GoodsIssueId_seq    SEQUENCE     �   ALTER TABLE dbo."GoodsIssue" ALTER COLUMN "GoodsIssueId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."GoodsIssue_GoodsIssueId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    237    6            �            1259    17306    GoodsReceipt    TABLE       CREATE TABLE dbo."GoodsReceipt" (
    "GoodsReceiptId" bigint NOT NULL,
    "GoodsReceiptCode" character varying NOT NULL,
    "WarehouseId" bigint NOT NULL,
    "Description" character varying NOT NULL,
    "CreatedByUserId" bigint NOT NULL,
    "DateCreated" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateLastUpdated" timestamp with time zone,
    "Status" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."GoodsReceipt";
       dbo         heap    postgres    false    6            �            1259    17327    GoodsReceiptItem    TABLE     �   CREATE TABLE dbo."GoodsReceiptItem" (
    "GoodsReceiptId" bigint NOT NULL,
    "ItemId" bigint NOT NULL,
    "Quantity" numeric DEFAULT 0 NOT NULL
);
 #   DROP TABLE dbo."GoodsReceiptItem";
       dbo         heap    postgres    false    6            �            1259    17305    GoodsReceipt_GoodsReceiptId_seq    SEQUENCE     �   ALTER TABLE dbo."GoodsReceipt" ALTER COLUMN "GoodsReceiptId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."GoodsReceipt_GoodsReceiptId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    234            �            1259    17229    InventoryRequest    TABLE     7  CREATE TABLE dbo."InventoryRequest" (
    "InventoryRequestId" bigint NOT NULL,
    "InventoryRequestCode" character varying,
    "BranchId" bigint NOT NULL,
    "Description" character varying NOT NULL,
    "RequestedByUserId" bigint NOT NULL,
    "DateRequested" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateLastUpdated" timestamp with time zone,
    "RequestStatus" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "FromWarehouseId" bigint NOT NULL
);
 #   DROP TABLE dbo."InventoryRequest";
       dbo         heap    postgres    false    6            �            1259    17270    InventoryRequestItem    TABLE     �   CREATE TABLE dbo."InventoryRequestItem" (
    "InventoryRequestId" bigint NOT NULL,
    "ItemId" bigint NOT NULL,
    "Quantity" numeric DEFAULT 0 NOT NULL,
    "InventoryRequestRateId" bigint NOT NULL,
    "TotalAmount" numeric DEFAULT 0 NOT NULL
);
 '   DROP TABLE dbo."InventoryRequestItem";
       dbo         heap    postgres    false    6            �            1259    17465    InventoryRequestRate    TABLE     �  CREATE TABLE dbo."InventoryRequestRate" (
    "InventoryRequestRateId" bigint NOT NULL,
    "ItemId" bigint NOT NULL,
    "Rate" numeric NOT NULL,
    "RateName" character varying NOT NULL,
    "MinQuantity" bigint DEFAULT 0 NOT NULL,
    "MaxQuantity" bigint DEFAULT 0 NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "BaseRate" boolean DEFAULT false NOT NULL,
    "InventoryRequestRateCode" character varying
);
 '   DROP TABLE dbo."InventoryRequestRate";
       dbo         heap    postgres    false    6            �            1259    17464 /   InventoryRequestRate_InventoryRequestRateId_seq    SEQUENCE       ALTER TABLE dbo."InventoryRequestRate" ALTER COLUMN "InventoryRequestRateId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."InventoryRequestRate_InventoryRequestRateId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    240            �            1259    17228 '   InventoryRequest_InventoryRequestId_seq    SEQUENCE     �   ALTER TABLE dbo."InventoryRequest" ALTER COLUMN "InventoryRequestId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."InventoryRequest_InventoryRequestId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    231            �            1259    17050    Item    TABLE     �  CREATE TABLE dbo."Item" (
    "ItemId" bigint NOT NULL,
    "ItemCode" character varying NOT NULL,
    "ItemName" character varying NOT NULL,
    "ItemDescription" character varying DEFAULT ''::character varying NOT NULL,
    "Price" numeric DEFAULT 0 NOT NULL,
    "ItemCategoryId" bigint NOT NULL,
    "DateAdded" date DEFAULT now() NOT NULL,
    "DateLastUpdated" date,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."Item";
       dbo         heap    postgres    false    6            �            1259    17146 
   ItemBranch    TABLE     �   CREATE TABLE dbo."ItemBranch" (
    "ItemId" bigint NOT NULL,
    "BranchId" bigint NOT NULL,
    "Quantity" bigint DEFAULT 0 NOT NULL
);
    DROP TABLE dbo."ItemBranch";
       dbo         heap    postgres    false    6            �            1259    17016    ItemCategory    TABLE     �   CREATE TABLE dbo."ItemCategory" (
    "ItemCategoryId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "ItemCategoryCode" character varying
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
            dbo          postgres    false    6    221            �            1259    17086    ItemWarehouse    TABLE     �   CREATE TABLE dbo."ItemWarehouse" (
    "ItemId" bigint NOT NULL,
    "WarehouseId" bigint NOT NULL,
    "Quantity" bigint DEFAULT 0 NOT NULL,
    "OrderedQuantity" bigint DEFAULT 0 NOT NULL
);
     DROP TABLE dbo."ItemWarehouse";
       dbo         heap    postgres    false    6            �            1259    17049    Item_ItemId_seq    SEQUENCE     �   ALTER TABLE dbo."Item" ALTER COLUMN "ItemId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Item_ItemId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    223            �            1259    16931    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    6            �            1259    16936    Users    TABLE     t  CREATE TABLE dbo."Users" (
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
    "Address" character varying DEFAULT 'NA'::character varying NOT NULL,
    "BranchId" bigint NOT NULL
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
            dbo          postgres    false    216    6            �            1259    17073 	   Warehouse    TABLE     �   CREATE TABLE dbo."Warehouse" (
    "WarehouseId" bigint NOT NULL,
    "WarehouseCode" character varying NOT NULL,
    "Name" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."Warehouse";
       dbo         heap    postgres    false    6            �            1259    17072    Warehouse_WarehouseId_seq    SEQUENCE     �   ALTER TABLE dbo."Warehouse" ALTER COLUMN "WarehouseId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Warehouse_WarehouseId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    225            �          0    17005    Access 
   TABLE DATA           Z   COPY dbo."Access" ("AccessId", "Name", "AccessPages", "Active", "AccessCode") FROM stdin;
    dbo          postgres    false    219   c�       �          0    17130    Branch 
   TABLE DATA           [   COPY dbo."Branch" ("BranchId", "BranchCode", "Name", "Active", "IsMainBranch") FROM stdin;
    dbo          postgres    false    228   r�       �          0    17381 
   GoodsIssue 
   TABLE DATA           �   COPY dbo."GoodsIssue" ("GoodsIssueId", "GoodsIssueCode", "WarehouseId", "Description", "IssueType", "CreatedByUserId", "DateCreated", "DateLastUpdated", "Status", "Active") FROM stdin;
    dbo          postgres    false    237   ��       �          0    17401    GoodsIssueItem 
   TABLE DATA           M   COPY dbo."GoodsIssueItem" ("GoodsIssueId", "ItemId", "Quantity") FROM stdin;
    dbo          postgres    false    238   ̝       �          0    17306    GoodsReceipt 
   TABLE DATA           �   COPY dbo."GoodsReceipt" ("GoodsReceiptId", "GoodsReceiptCode", "WarehouseId", "Description", "CreatedByUserId", "DateCreated", "DateLastUpdated", "Status", "Active") FROM stdin;
    dbo          postgres    false    234   �       �          0    17327    GoodsReceiptItem 
   TABLE DATA           Q   COPY dbo."GoodsReceiptItem" ("GoodsReceiptId", "ItemId", "Quantity") FROM stdin;
    dbo          postgres    false    235   �       �          0    17229    InventoryRequest 
   TABLE DATA           �   COPY dbo."InventoryRequest" ("InventoryRequestId", "InventoryRequestCode", "BranchId", "Description", "RequestedByUserId", "DateRequested", "DateLastUpdated", "RequestStatus", "Active", "FromWarehouseId") FROM stdin;
    dbo          postgres    false    231   #�       �          0    17270    InventoryRequestItem 
   TABLE DATA           �   COPY dbo."InventoryRequestItem" ("InventoryRequestId", "ItemId", "Quantity", "InventoryRequestRateId", "TotalAmount") FROM stdin;
    dbo          postgres    false    232   @�       �          0    17465    InventoryRequestRate 
   TABLE DATA           �   COPY dbo."InventoryRequestRate" ("InventoryRequestRateId", "ItemId", "Rate", "RateName", "MinQuantity", "MaxQuantity", "Active", "BaseRate", "InventoryRequestRateCode") FROM stdin;
    dbo          postgres    false    240   ]�       �          0    17050    Item 
   TABLE DATA           �   COPY dbo."Item" ("ItemId", "ItemCode", "ItemName", "ItemDescription", "Price", "ItemCategoryId", "DateAdded", "DateLastUpdated", "Active") FROM stdin;
    dbo          postgres    false    223   ��       �          0    17146 
   ItemBranch 
   TABLE DATA           E   COPY dbo."ItemBranch" ("ItemId", "BranchId", "Quantity") FROM stdin;
    dbo          postgres    false    229   �       �          0    17016    ItemCategory 
   TABLE DATA           l   COPY dbo."ItemCategory" ("ItemCategoryId", "Name", "Description", "Active", "ItemCategoryCode") FROM stdin;
    dbo          postgres    false    221   �       �          0    17086    ItemWarehouse 
   TABLE DATA           ^   COPY dbo."ItemWarehouse" ("ItemId", "WarehouseId", "Quantity", "OrderedQuantity") FROM stdin;
    dbo          postgres    false    226   J�       �          0    16931    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    215   q�       �          0    16936    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "UserName", "Password", "FullName", "Gender", "BirthDate", "MobileNumber", "Email", "AccessGranted", "AccessId", "Active", "UserCode", "Address", "BranchId") FROM stdin;
    dbo          postgres    false    216   ��       �          0    17073 	   Warehouse 
   TABLE DATA           T   COPY dbo."Warehouse" ("WarehouseId", "WarehouseCode", "Name", "Active") FROM stdin;
    dbo          postgres    false    225   ��       �           0    0    Access_AccessId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Access_AccessId_seq"', 2, true);
          dbo          postgres    false    218            �           0    0    Branch_BranchId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Branch_BranchId_seq"', 2, true);
          dbo          postgres    false    227            �           0    0    GoodsIssue_GoodsIssueId_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('dbo."GoodsIssue_GoodsIssueId_seq"', 1, false);
          dbo          postgres    false    236            �           0    0    GoodsReceipt_GoodsReceiptId_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('dbo."GoodsReceipt_GoodsReceiptId_seq"', 1, false);
          dbo          postgres    false    233            �           0    0 /   InventoryRequestRate_InventoryRequestRateId_seq    SEQUENCE SET     \   SELECT pg_catalog.setval('dbo."InventoryRequestRate_InventoryRequestRateId_seq"', 3, true);
          dbo          postgres    false    239            �           0    0 '   InventoryRequest_InventoryRequestId_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('dbo."InventoryRequest_InventoryRequestId_seq"', 1, false);
          dbo          postgres    false    230            �           0    0    ItemCategory_ItemCategoryId_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('dbo."ItemCategory_ItemCategoryId_seq"', 1, true);
          dbo          postgres    false    220            �           0    0    Item_ItemId_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('dbo."Item_ItemId_seq"', 2, true);
          dbo          postgres    false    222            �           0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 2, true);
          dbo          postgres    false    217            �           0    0    Warehouse_WarehouseId_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('dbo."Warehouse_WarehouseId_seq"', 1, true);
          dbo          postgres    false    224            �           2606    17013    Access Access_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Access"
    ADD CONSTRAINT "Access_pkey" PRIMARY KEY ("AccessId");
 =   ALTER TABLE ONLY dbo."Access" DROP CONSTRAINT "Access_pkey";
       dbo            postgres    false    219            �           2606    17137    Branch Branch_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Branch"
    ADD CONSTRAINT "Branch_pkey" PRIMARY KEY ("BranchId");
 =   ALTER TABLE ONLY dbo."Branch" DROP CONSTRAINT "Branch_pkey";
       dbo            postgres    false    228            �           2606    17486 "   GoodsIssueItem GoodsIssueItem_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY dbo."GoodsIssueItem"
    ADD CONSTRAINT "GoodsIssueItem_pkey" PRIMARY KEY ("GoodsIssueId", "ItemId");
 M   ALTER TABLE ONLY dbo."GoodsIssueItem" DROP CONSTRAINT "GoodsIssueItem_pkey";
       dbo            postgres    false    238    238            �           2606    17390    GoodsIssue GoodsIssue_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY dbo."GoodsIssue"
    ADD CONSTRAINT "GoodsIssue_pkey" PRIMARY KEY ("GoodsIssueId");
 E   ALTER TABLE ONLY dbo."GoodsIssue" DROP CONSTRAINT "GoodsIssue_pkey";
       dbo            postgres    false    237            �           2606    17488 &   GoodsReceiptItem GoodsReceiptItem_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY dbo."GoodsReceiptItem"
    ADD CONSTRAINT "GoodsReceiptItem_pkey" PRIMARY KEY ("GoodsReceiptId", "ItemId");
 Q   ALTER TABLE ONLY dbo."GoodsReceiptItem" DROP CONSTRAINT "GoodsReceiptItem_pkey";
       dbo            postgres    false    235    235            �           2606    17315    GoodsReceipt GoodsReceipt_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."GoodsReceipt"
    ADD CONSTRAINT "GoodsReceipt_pkey" PRIMARY KEY ("GoodsReceiptId");
 I   ALTER TABLE ONLY dbo."GoodsReceipt" DROP CONSTRAINT "GoodsReceipt_pkey";
       dbo            postgres    false    234            �           2606    17278 .   InventoryRequestItem InventoryRequestItem_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequestItem"
    ADD CONSTRAINT "InventoryRequestItem_pkey" PRIMARY KEY ("InventoryRequestId", "ItemId");
 Y   ALTER TABLE ONLY dbo."InventoryRequestItem" DROP CONSTRAINT "InventoryRequestItem_pkey";
       dbo            postgres    false    232    232            �           2606    17474 .   InventoryRequestRate InventoryRequestRate_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequestRate"
    ADD CONSTRAINT "InventoryRequestRate_pkey" PRIMARY KEY ("InventoryRequestRateId");
 Y   ALTER TABLE ONLY dbo."InventoryRequestRate" DROP CONSTRAINT "InventoryRequestRate_pkey";
       dbo            postgres    false    240            �           2606    17238 &   InventoryRequest InventoryRequest_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY dbo."InventoryRequest"
    ADD CONSTRAINT "InventoryRequest_pkey" PRIMARY KEY ("InventoryRequestId");
 Q   ALTER TABLE ONLY dbo."InventoryRequest" DROP CONSTRAINT "InventoryRequest_pkey";
       dbo            postgres    false    231            �           2606    17151    ItemBranch ItemBranch_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."ItemBranch"
    ADD CONSTRAINT "ItemBranch_pkey" PRIMARY KEY ("BranchId", "ItemId");
 E   ALTER TABLE ONLY dbo."ItemBranch" DROP CONSTRAINT "ItemBranch_pkey";
       dbo            postgres    false    229    229            �           2606    17023    ItemCategory ItemCategory_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."ItemCategory"
    ADD CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("ItemCategoryId");
 I   ALTER TABLE ONLY dbo."ItemCategory" DROP CONSTRAINT "ItemCategory_pkey";
       dbo            postgres    false    221            �           2606    17091     ItemWarehouse ItemWarehouse_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY dbo."ItemWarehouse"
    ADD CONSTRAINT "ItemWarehouse_pkey" PRIMARY KEY ("WarehouseId", "ItemId");
 K   ALTER TABLE ONLY dbo."ItemWarehouse" DROP CONSTRAINT "ItemWarehouse_pkey";
       dbo            postgres    false    226    226            �           2606    17060    Item Item_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY dbo."Item"
    ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("ItemId");
 9   ALTER TABLE ONLY dbo."Item" DROP CONSTRAINT "Item_pkey";
       dbo            postgres    false    223            �           2606    16956    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    215            �           2606    17080    Warehouse Warehouse_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY dbo."Warehouse"
    ADD CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("WarehouseId");
 C   ALTER TABLE ONLY dbo."Warehouse" DROP CONSTRAINT "Warehouse_pkey";
       dbo            postgres    false    225            �           2606    16960    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    216            �           1259    17144    u_branch_branchCode    INDEX     �   CREATE UNIQUE INDEX "u_branch_branchCode" ON dbo."Branch" USING btree ("BranchCode", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
 &   DROP INDEX dbo."u_branch_branchCode";
       dbo            postgres    false    228    228    228            �           1259    17145    u_branch_name    INDEX     �   CREATE UNIQUE INDEX u_branch_name ON dbo."Branch" USING btree ("Name", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_branch_name;
       dbo            postgres    false    228    228    228            �           1259    17070    u_item_itemCode    INDEX     �   CREATE UNIQUE INDEX "u_item_itemCode" ON dbo."Item" USING btree ("ItemCode", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
 "   DROP INDEX dbo."u_item_itemCode";
       dbo            postgres    false    223    223    223            �           1259    17071    u_item_itemName    INDEX     �   CREATE UNIQUE INDEX "u_item_itemName" ON dbo."Item" USING btree ("ItemName", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
 "   DROP INDEX dbo."u_item_itemName";
       dbo            postgres    false    223    223    223            �           1259    17045    u_itemcategory    INDEX     �   CREATE UNIQUE INDEX u_itemcategory ON dbo."ItemCategory" USING btree ("Name", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_itemcategory;
       dbo            postgres    false    221    221    221            �           1259    17040    u_user    INDEX     �   CREATE UNIQUE INDEX u_user ON dbo."Users" USING btree ("UserName", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_user;
       dbo            postgres    false    216    216    216            �           1259    17042    u_user_email    INDEX     �   CREATE UNIQUE INDEX u_user_email ON dbo."Users" USING btree ("Email", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_user_email;
       dbo            postgres    false    216    216    216            �           1259    17041    u_user_number    INDEX     �   CREATE UNIQUE INDEX u_user_number ON dbo."Users" USING btree ("MobileNumber", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_user_number;
       dbo            postgres    false    216    216    216            �           1259    17093    u_warehouse_name    INDEX     �   CREATE UNIQUE INDEX u_warehouse_name ON dbo."Warehouse" USING btree ("Name", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
 !   DROP INDEX dbo.u_warehouse_name;
       dbo            postgres    false    225    225    225            �           1259    17092    u_warehouse_warehouseCode    INDEX     �   CREATE UNIQUE INDEX "u_warehouse_warehouseCode" ON dbo."Warehouse" USING btree ("WarehouseCode", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
 ,   DROP INDEX dbo."u_warehouse_warehouseCode";
       dbo            postgres    false    225    225    225            �           2606    17032    Users fk_User_Access    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT "fk_User_Access" FOREIGN KEY ("AccessId") REFERENCES dbo."Access"("AccessId") NOT VALID;
 ?   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT "fk_User_Access";
       dbo          postgres    false    216    3285    219                       2606    17391 (   GoodsIssue fk_goodsissue_createdbyuserid    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsIssue"
    ADD CONSTRAINT fk_goodsissue_createdbyuserid FOREIGN KEY ("CreatedByUserId") REFERENCES dbo."Users"("UserId");
 Q   ALTER TABLE ONLY dbo."GoodsIssue" DROP CONSTRAINT fk_goodsissue_createdbyuserid;
       dbo          postgres    false    216    3280    237            	           2606    17396 "   GoodsIssue fk_goodsissue_warehouse    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsIssue"
    ADD CONSTRAINT fk_goodsissue_warehouse FOREIGN KEY ("WarehouseId") REFERENCES dbo."Warehouse"("WarehouseId");
 K   ALTER TABLE ONLY dbo."GoodsIssue" DROP CONSTRAINT fk_goodsissue_warehouse;
       dbo          postgres    false    237    225    3294            
           2606    17407 +   GoodsIssueItem fk_goodsissueitem_goodsissue    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsIssueItem"
    ADD CONSTRAINT fk_goodsissueitem_goodsissue FOREIGN KEY ("GoodsIssueId") REFERENCES dbo."GoodsIssue"("GoodsIssueId");
 T   ALTER TABLE ONLY dbo."GoodsIssueItem" DROP CONSTRAINT fk_goodsissueitem_goodsissue;
       dbo          postgres    false    237    3314    238                       2606    17412 %   GoodsIssueItem fk_goodsissueitem_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsIssueItem"
    ADD CONSTRAINT fk_goodsissueitem_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 N   ALTER TABLE ONLY dbo."GoodsIssueItem" DROP CONSTRAINT fk_goodsissueitem_item;
       dbo          postgres    false    238    223    3290                       2606    17321 ,   GoodsReceipt fk_goodsreceipt_createdbyuserid    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsReceipt"
    ADD CONSTRAINT fk_goodsreceipt_createdbyuserid FOREIGN KEY ("CreatedByUserId") REFERENCES dbo."Users"("UserId");
 U   ALTER TABLE ONLY dbo."GoodsReceipt" DROP CONSTRAINT fk_goodsreceipt_createdbyuserid;
       dbo          postgres    false    234    216    3280                       2606    17316 &   GoodsReceipt fk_goodsreceipt_warehouse    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsReceipt"
    ADD CONSTRAINT fk_goodsreceipt_warehouse FOREIGN KEY ("WarehouseId") REFERENCES dbo."Warehouse"("WarehouseId");
 O   ALTER TABLE ONLY dbo."GoodsReceipt" DROP CONSTRAINT fk_goodsreceipt_warehouse;
       dbo          postgres    false    3294    225    234                       2606    17333 1   GoodsReceiptItem fk_goodsreceiptitem_goodsreceipt    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsReceiptItem"
    ADD CONSTRAINT fk_goodsreceiptitem_goodsreceipt FOREIGN KEY ("GoodsReceiptId") REFERENCES dbo."GoodsReceipt"("GoodsReceiptId");
 Z   ALTER TABLE ONLY dbo."GoodsReceiptItem" DROP CONSTRAINT fk_goodsreceiptitem_goodsreceipt;
       dbo          postgres    false    235    3310    234                       2606    17338 )   GoodsReceiptItem fk_goodsreceiptitem_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsReceiptItem"
    ADD CONSTRAINT fk_goodsreceiptitem_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 R   ALTER TABLE ONLY dbo."GoodsReceiptItem" DROP CONSTRAINT fk_goodsreceiptitem_item;
       dbo          postgres    false    235    3290    223                       2606    17475 1   InventoryRequestRate fk_inventoryRequestrate_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequestRate"
    ADD CONSTRAINT "fk_inventoryRequestrate_item" FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 \   ALTER TABLE ONLY dbo."InventoryRequestRate" DROP CONSTRAINT "fk_inventoryRequestrate_item";
       dbo          postgres    false    240    3290    223            �           2606    17239 +   InventoryRequest fk_inventoryrequest_branch    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequest"
    ADD CONSTRAINT fk_inventoryrequest_branch FOREIGN KEY ("BranchId") REFERENCES dbo."Branch"("BranchId");
 T   ALTER TABLE ONLY dbo."InventoryRequest" DROP CONSTRAINT fk_inventoryrequest_branch;
       dbo          postgres    false    228    3300    231            �           2606    17489 4   InventoryRequest fk_inventoryrequest_fromwarehouseid    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequest"
    ADD CONSTRAINT fk_inventoryrequest_fromwarehouseid FOREIGN KEY ("FromWarehouseId") REFERENCES dbo."Warehouse"("WarehouseId") NOT VALID;
 ]   ALTER TABLE ONLY dbo."InventoryRequest" DROP CONSTRAINT fk_inventoryrequest_fromwarehouseid;
       dbo          postgres    false    3294    231    225                        2606    17244 6   InventoryRequest fk_inventoryrequest_requestedbyuserId    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequest"
    ADD CONSTRAINT "fk_inventoryrequest_requestedbyuserId" FOREIGN KEY ("RequestedByUserId") REFERENCES dbo."Users"("UserId");
 a   ALTER TABLE ONLY dbo."InventoryRequest" DROP CONSTRAINT "fk_inventoryrequest_requestedbyuserId";
       dbo          postgres    false    231    216    3280                       2606    17279 =   InventoryRequestItem fk_inventoryrequestitem_inventoryrequest    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequestItem"
    ADD CONSTRAINT fk_inventoryrequestitem_inventoryrequest FOREIGN KEY ("InventoryRequestId") REFERENCES dbo."InventoryRequest"("InventoryRequestId");
 f   ALTER TABLE ONLY dbo."InventoryRequestItem" DROP CONSTRAINT fk_inventoryrequestitem_inventoryrequest;
       dbo          postgres    false    3306    232    231                       2606    17480 C   InventoryRequestItem fk_inventoryrequestitem_inventoryrequestrateId    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequestItem"
    ADD CONSTRAINT "fk_inventoryrequestitem_inventoryrequestrateId" FOREIGN KEY ("InventoryRequestRateId") REFERENCES dbo."InventoryRequestRate"("InventoryRequestRateId") NOT VALID;
 n   ALTER TABLE ONLY dbo."InventoryRequestItem" DROP CONSTRAINT "fk_inventoryrequestitem_inventoryrequestrateId";
       dbo          postgres    false    232    3318    240                       2606    17284 1   InventoryRequestItem fk_inventoryrequestitem_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequestItem"
    ADD CONSTRAINT fk_inventoryrequestitem_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 Z   ALTER TABLE ONLY dbo."InventoryRequestItem" DROP CONSTRAINT fk_inventoryrequestitem_item;
       dbo          postgres    false    232    223    3290            �           2606    17061    Item fk_item_itemcategory    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Item"
    ADD CONSTRAINT fk_item_itemcategory FOREIGN KEY ("ItemCategoryId") REFERENCES dbo."ItemCategory"("ItemCategoryId");
 B   ALTER TABLE ONLY dbo."Item" DROP CONSTRAINT fk_item_itemcategory;
       dbo          postgres    false    3287    223    221            �           2606    17157    ItemBranch fk_itembranch_branch    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ItemBranch"
    ADD CONSTRAINT fk_itembranch_branch FOREIGN KEY ("BranchId") REFERENCES dbo."Branch"("BranchId");
 H   ALTER TABLE ONLY dbo."ItemBranch" DROP CONSTRAINT fk_itembranch_branch;
       dbo          postgres    false    229    3300    228            �           2606    17152    ItemBranch fk_itembranch_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ItemBranch"
    ADD CONSTRAINT fk_itembranch_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 F   ALTER TABLE ONLY dbo."ItemBranch" DROP CONSTRAINT fk_itembranch_item;
       dbo          postgres    false    3290    223    229            �           2606    17094 #   ItemWarehouse fk_itemwarehouse_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ItemWarehouse"
    ADD CONSTRAINT fk_itemwarehouse_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId") NOT VALID;
 L   ALTER TABLE ONLY dbo."ItemWarehouse" DROP CONSTRAINT fk_itemwarehouse_item;
       dbo          postgres    false    223    226    3290            �           2606    17099 (   ItemWarehouse fk_itemwarehouse_warehouse    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ItemWarehouse"
    ADD CONSTRAINT fk_itemwarehouse_warehouse FOREIGN KEY ("WarehouseId") REFERENCES dbo."Warehouse"("WarehouseId") NOT VALID;
 Q   ALTER TABLE ONLY dbo."ItemWarehouse" DROP CONSTRAINT fk_itemwarehouse_warehouse;
       dbo          postgres    false    226    3294    225            �           2606    17206    Users fk_user_branch    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT fk_user_branch FOREIGN KEY ("BranchId") REFERENCES dbo."Branch"("BranchId") NOT VALID;
 =   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT fk_user_branch;
       dbo          postgres    false    3300    228    216            �   �   x����n�0�g�)����0�Ѳt`A�:P��9K$n}�x��V����ě}�?Yw�MŃ�Z�
���,֟p0�3�!Ƞ����wg��3�֛ް�PY �[�.�Sv��p�����@��Ȟ�ް�Z�{CC@�V�.�xDOՐ�zDOE�H*���	屚�V�K����KM?39NϿ�N����L�D��0����_�rݵ4�-�RHK�#Q�?��%;J�H-m��j��m�mi3��wR�/�@]      �   -   x�3��u��s
r�s�@f�p�pq:%�%g���4�=... �_�      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   :   x�3�4���b0�@���$``�i��_a q	gDވ˘�"��ט+F��� �z      �   6   x�3��,I�5D!A����X��P���Y�eVc��D��������� <�!      �      x�3�4�4�2�4�F`������ 3�e      �       x�3��,I�UHN,1Db�p��!W� ���      �      x�3�4�4�4�2��1z\\\ �x      �      x������ � �      �   �   x�U�Ko�@��w~�P��t��G)j�}��A��t���P}K�=�9��|,U*MU4�X&f}��ڬ�U����6���.��}_�7�@����وP~� �G����WC���� �����O�O�1��PH[��J쏼ųR�FC�̥[����e�<���7��W�Gٞ�K�xx����C���t]H����� ,���G�55D��������+Cz6��!%�:!��@X      �   $   x�3�tqus�	�wr��v�"R����� -�     