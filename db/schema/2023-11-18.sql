PGDMP     (                
    {            enoerp    15.4    15.4 >    ]           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ^           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            _           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            `           1262    16875    enoerp    DATABASE     �   CREATE DATABASE enoerp WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE enoerp;
                postgres    false                        2615    16876    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            �            1255    16877    usp_reset() 	   PROCEDURE     	  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

	DELETE FROM dbo."Users";
	DELETE FROM dbo."Access";
	DELETE FROM dbo."ItemBranch";
	DELETE FROM dbo."ItemWarehouse";
	DELETE FROM dbo."Item";
	DELETE FROM dbo."ItemCategory";
	DELETE FROM dbo."Warehouse";
	DELETE FROM dbo."Branch";
	
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
            dbo          postgres    false    219    6            �            1259    17130    Branch    TABLE     �   CREATE TABLE dbo."Branch" (
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
            dbo          postgres    false    228    6            �            1259    17050    Item    TABLE     �  CREATE TABLE dbo."Item" (
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
            dbo          postgres    false    6    221            �            1259    17086    ItemWarehouse    TABLE     �   CREATE TABLE dbo."ItemWarehouse" (
    "ItemId" bigint NOT NULL,
    "WarehouseId" bigint NOT NULL,
    "Quantity" bigint DEFAULT 0 NOT NULL
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
            dbo          postgres    false    225    6            P          0    17005    Access 
   TABLE DATA           L   COPY dbo."Access" ("AccessId", "Name", "AccessPages", "Active") FROM stdin;
    dbo          postgres    false    219   {S       Y          0    17130    Branch 
   TABLE DATA           [   COPY dbo."Branch" ("BranchId", "BranchCode", "Name", "Active", "IsMainBranch") FROM stdin;
    dbo          postgres    false    228   �S       T          0    17050    Item 
   TABLE DATA           �   COPY dbo."Item" ("ItemId", "ItemCode", "ItemName", "ItemDescription", "Price", "ItemCategoryId", "DateAdded", "DateLastUpdated", "Active") FROM stdin;
    dbo          postgres    false    223   (T       Z          0    17146 
   ItemBranch 
   TABLE DATA           E   COPY dbo."ItemBranch" ("ItemId", "BranchId", "Quantity") FROM stdin;
    dbo          postgres    false    229   ET       R          0    17016    ItemCategory 
   TABLE DATA           X   COPY dbo."ItemCategory" ("ItemCategoryId", "Name", "Description", "Active") FROM stdin;
    dbo          postgres    false    221   bT       W          0    17086    ItemWarehouse 
   TABLE DATA           K   COPY dbo."ItemWarehouse" ("ItemId", "WarehouseId", "Quantity") FROM stdin;
    dbo          postgres    false    226   T       L          0    16931    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    215   �T       M          0    16936    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "UserName", "Password", "FullName", "Gender", "BirthDate", "MobileNumber", "Email", "AccessGranted", "AccessId", "Active", "UserCode", "Address", "BranchId") FROM stdin;
    dbo          postgres    false    216   �T       V          0    17073 	   Warehouse 
   TABLE DATA           T   COPY dbo."Warehouse" ("WarehouseId", "WarehouseCode", "Name", "Active") FROM stdin;
    dbo          postgres    false    225   VU       a           0    0    Access_AccessId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Access_AccessId_seq"', 1, true);
          dbo          postgres    false    218            b           0    0    Branch_BranchId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Branch_BranchId_seq"', 1, true);
          dbo          postgres    false    227            c           0    0    ItemCategory_ItemCategoryId_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('dbo."ItemCategory_ItemCategoryId_seq"', 1, false);
          dbo          postgres    false    220            d           0    0    Item_ItemId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Item_ItemId_seq"', 1, false);
          dbo          postgres    false    222            e           0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 1, true);
          dbo          postgres    false    217            f           0    0    Warehouse_WarehouseId_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('dbo."Warehouse_WarehouseId_seq"', 1, true);
          dbo          postgres    false    224            �           2606    17013    Access Access_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Access"
    ADD CONSTRAINT "Access_pkey" PRIMARY KEY ("AccessId");
 =   ALTER TABLE ONLY dbo."Access" DROP CONSTRAINT "Access_pkey";
       dbo            postgres    false    219            �           2606    17137    Branch Branch_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Branch"
    ADD CONSTRAINT "Branch_pkey" PRIMARY KEY ("BranchId");
 =   ALTER TABLE ONLY dbo."Branch" DROP CONSTRAINT "Branch_pkey";
       dbo            postgres    false    228            �           2606    17151    ItemBranch ItemBranch_pkey 
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
       dbo          postgres    false    3235    216    219            �           2606    17061    Item fk_item_itemcategory    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Item"
    ADD CONSTRAINT fk_item_itemcategory FOREIGN KEY ("ItemCategoryId") REFERENCES dbo."ItemCategory"("ItemCategoryId");
 B   ALTER TABLE ONLY dbo."Item" DROP CONSTRAINT fk_item_itemcategory;
       dbo          postgres    false    221    223    3237            �           2606    17157    ItemBranch fk_itembranch_branch    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ItemBranch"
    ADD CONSTRAINT fk_itembranch_branch FOREIGN KEY ("BranchId") REFERENCES dbo."Branch"("BranchId");
 H   ALTER TABLE ONLY dbo."ItemBranch" DROP CONSTRAINT fk_itembranch_branch;
       dbo          postgres    false    229    3250    228            �           2606    17152    ItemBranch fk_itembranch_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ItemBranch"
    ADD CONSTRAINT fk_itembranch_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 F   ALTER TABLE ONLY dbo."ItemBranch" DROP CONSTRAINT fk_itembranch_item;
       dbo          postgres    false    3240    229    223            �           2606    17094 #   ItemWarehouse fk_itemwarehouse_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ItemWarehouse"
    ADD CONSTRAINT fk_itemwarehouse_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId") NOT VALID;
 L   ALTER TABLE ONLY dbo."ItemWarehouse" DROP CONSTRAINT fk_itemwarehouse_item;
       dbo          postgres    false    226    3240    223            �           2606    17099 (   ItemWarehouse fk_itemwarehouse_warehouse    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ItemWarehouse"
    ADD CONSTRAINT fk_itemwarehouse_warehouse FOREIGN KEY ("WarehouseId") REFERENCES dbo."Warehouse"("WarehouseId") NOT VALID;
 Q   ALTER TABLE ONLY dbo."ItemWarehouse" DROP CONSTRAINT fk_itemwarehouse_warehouse;
       dbo          postgres    false    226    3244    225            �           2606    17206    Users fk_user_branch    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT fk_user_branch FOREIGN KEY ("BranchId") REFERENCES dbo."Branch"("BranchId") NOT VALID;
 =   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT fk_user_branch;
       dbo          postgres    false    3250    216    228            P   n   x�3�tL���㌎�S �jCAA� 1=U�JA�%�8#)?�(EII�,3�([RT��,�����V�E�(3=��(���gmhqjQ1}�tLNN-���F,g	W� �^�      Y      x�3��u��s
r�s�@f�p�p��qqq ���      T      x������ � �      Z      x������ � �      R      x������ � �      W      x������ � �      L      x������ � �      M   �   x�3�LL����T1JR14P�)�3ήJKO��0Hs�rK1IM	u+�0�)5O���Huqq�-��v-t�J�+�H�t� &9�]�\\�8---t�u-8��ML�8Ss3s�A�^r~.g	�!��!��#�!W� oN(k      V   $   x�3�tqus�	�wr��v�"R����� -�     