PGDMP     7    )                {            enoerpbackup    15.4    15.4 �                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            !           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            "           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            #           1262    17684    enoerpbackup    DATABASE     �   CREATE DATABASE enoerpbackup WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE enoerpbackup;
                postgres    false                        2615    20211    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            	           1255    20212    usp_reset() 	   PROCEDURE     Q  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

	DELETE FROM dbo."GatewayConnectedUsers";
	DELETE FROM dbo."Notifications";
	DELETE FROM dbo."SalesInvoicePayments";
	DELETE FROM dbo."SalesInvoiceItem";
	DELETE FROM dbo."SalesInvoice";	
	DELETE FROM dbo."InventoryAdjustmentReportItem";
	DELETE FROM dbo."InventoryAdjustmentReport";
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
	DELETE FROM dbo."Supplier";
	
	ALTER SEQUENCE dbo."GatewayConnectedUsers_Id_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Notifications_NotificationId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."SalesInvoice_SalesInvoiceId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."InventoryAdjustmentReport_InventoryAdjustmentReportId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."GoodsReceipt_GoodsReceiptId_seq" RESTART WITH 1;
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
	ALTER SEQUENCE dbo."Supplier_SupplierId_seq" RESTART WITH 1;
	
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
        "page": "Warehouse Inventory",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Inventory Masterlist",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Inventory Adjustment Report",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Adjustment Confirmation",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Inventory Request",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Incoming Inventory Request",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Sales Invoice",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Goods Receipt",
        "view": true,
        "modify": true,
        "rights": ["Approval"]
      },
      {
        "page": "Goods Issue",
        "view": true,
        "modify": true,
        "rights": ["Approval"]
      },
      {
        "page": "Item",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Item Category",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Warehouse",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Supplier",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Inventory Request Rate",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Branch",
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
       dbo          postgres    false    6            �            1259    20213    Access    TABLE     �   CREATE TABLE dbo."Access" (
    "AccessId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "AccessPages" json DEFAULT '[]'::json NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "AccessCode" character varying
);
    DROP TABLE dbo."Access";
       dbo         heap    postgres    false    6            �            1259    20220    Access_AccessId_seq    SEQUENCE     �   ALTER TABLE dbo."Access" ALTER COLUMN "AccessId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Access_AccessId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    215    6            �            1259    20221    Branch    TABLE     �   CREATE TABLE dbo."Branch" (
    "BranchId" bigint NOT NULL,
    "BranchCode" character varying NOT NULL,
    "Name" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "IsMainBranch" boolean DEFAULT false NOT NULL
);
    DROP TABLE dbo."Branch";
       dbo         heap    postgres    false    6            �            1259    20228    Branch_BranchId_seq    SEQUENCE     �   ALTER TABLE dbo."Branch" ALTER COLUMN "BranchId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Branch_BranchId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    217            �            1259    20229    GatewayConnectedUsers    TABLE     �   CREATE TABLE dbo."GatewayConnectedUsers" (
    "Id" bigint NOT NULL,
    "SocketId" character varying(100) NOT NULL,
    "UserId" bigint NOT NULL
);
 (   DROP TABLE dbo."GatewayConnectedUsers";
       dbo         heap    postgres    false    6            �            1259    20232    GatewayConnectedUsers_Id_seq    SEQUENCE     �   ALTER TABLE dbo."GatewayConnectedUsers" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."GatewayConnectedUsers_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    219    6            �            1259    20233 
   GoodsIssue    TABLE     c  CREATE TABLE dbo."GoodsIssue" (
    "GoodsIssueId" bigint NOT NULL,
    "GoodsIssueCode" character varying,
    "WarehouseId" bigint NOT NULL,
    "Description" character varying NOT NULL,
    "IssueType" character varying NOT NULL,
    "CreatedByUserId" bigint NOT NULL,
    "DateCreated" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateLastUpdated" timestamp with time zone,
    "Status" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "Notes" character varying,
    "LastUpdatedByUserId" bigint
);
    DROP TABLE dbo."GoodsIssue";
       dbo         heap    postgres    false    6            �            1259    20241    GoodsIssueItem    TABLE     �   CREATE TABLE dbo."GoodsIssueItem" (
    "GoodsIssueId" bigint NOT NULL,
    "ItemId" bigint NOT NULL,
    "Quantity" numeric DEFAULT 0 NOT NULL
);
 !   DROP TABLE dbo."GoodsIssueItem";
       dbo         heap    postgres    false    6            �            1259    20247    GoodsIssue_GoodsIssueId_seq    SEQUENCE     �   ALTER TABLE dbo."GoodsIssue" ALTER COLUMN "GoodsIssueId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."GoodsIssue_GoodsIssueId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    221            �            1259    20248    GoodsReceipt    TABLE     }  CREATE TABLE dbo."GoodsReceipt" (
    "GoodsReceiptId" bigint NOT NULL,
    "GoodsReceiptCode" character varying,
    "WarehouseId" bigint NOT NULL,
    "Description" character varying NOT NULL,
    "CreatedByUserId" bigint NOT NULL,
    "DateCreated" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateLastUpdated" timestamp with time zone,
    "Status" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "Notes" character varying DEFAULT ''::character varying,
    "SupplierId" bigint NOT NULL,
    "LastUpdatedByUserId" bigint
);
    DROP TABLE dbo."GoodsReceipt";
       dbo         heap    postgres    false    6            �            1259    20257    GoodsReceiptItem    TABLE     �   CREATE TABLE dbo."GoodsReceiptItem" (
    "GoodsReceiptId" bigint NOT NULL,
    "ItemId" bigint NOT NULL,
    "Quantity" numeric DEFAULT 0 NOT NULL
);
 #   DROP TABLE dbo."GoodsReceiptItem";
       dbo         heap    postgres    false    6            �            1259    20263    GoodsReceipt_GoodsReceiptId_seq    SEQUENCE     �   ALTER TABLE dbo."GoodsReceipt" ALTER COLUMN "GoodsReceiptId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."GoodsReceipt_GoodsReceiptId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    224            �            1259    20264    InventoryAdjustmentReport    TABLE     �  CREATE TABLE dbo."InventoryAdjustmentReport" (
    "InventoryAdjustmentReportId" bigint NOT NULL,
    "InventoryAdjustmentReportCode" character varying,
    "InventoryRequestId" bigint NOT NULL,
    "ReportType" character varying NOT NULL,
    "BranchId" bigint NOT NULL,
    "Description" character varying NOT NULL,
    "ReportedByUserId" bigint NOT NULL,
    "DateReported" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateLastUpdated" timestamp with time zone,
    "ReportStatus" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "Notes" character varying,
    "Active" boolean DEFAULT true NOT NULL,
    "GoodsIssueId" bigint
);
 ,   DROP TABLE dbo."InventoryAdjustmentReport";
       dbo         heap    postgres    false    6            �            1259    20272    InventoryAdjustmentReportItem    TABLE        CREATE TABLE dbo."InventoryAdjustmentReportItem" (
    "InventoryAdjustmentReportId" bigint NOT NULL,
    "ItemId" bigint NOT NULL,
    "ReturnedQuantity" numeric DEFAULT 0 NOT NULL,
    "ProposedUnitReturnRate" numeric DEFAULT 0 NOT NULL,
    "TotalRefund" numeric DEFAULT 0 NOT NULL
);
 0   DROP TABLE dbo."InventoryAdjustmentReportItem";
       dbo         heap    postgres    false    6            �            1259    20280 9   InventoryAdjustmentReport_InventoryAdjustmentReportId_seq    SEQUENCE       ALTER TABLE dbo."InventoryAdjustmentReport" ALTER COLUMN "InventoryAdjustmentReportId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."InventoryAdjustmentReport_InventoryAdjustmentReportId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    227            �            1259    20281    InventoryRequest    TABLE     �  CREATE TABLE dbo."InventoryRequest" (
    "InventoryRequestId" bigint NOT NULL,
    "InventoryRequestCode" character varying,
    "BranchId" bigint NOT NULL,
    "Description" character varying NOT NULL,
    "RequestedByUserId" bigint NOT NULL,
    "DateRequested" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "DateLastUpdated" timestamp with time zone,
    "RequestStatus" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "FromWarehouseId" bigint NOT NULL,
    "Notes" character varying DEFAULT ''::character varying,
    "LastUpdatedByUserId" bigint
);
 #   DROP TABLE dbo."InventoryRequest";
       dbo         heap    postgres    false    6            �            1259    20290    InventoryRequestItem    TABLE     .  CREATE TABLE dbo."InventoryRequestItem" (
    "InventoryRequestId" bigint NOT NULL,
    "ItemId" bigint NOT NULL,
    "Quantity" numeric DEFAULT 0 NOT NULL,
    "InventoryRequestRateId" bigint NOT NULL,
    "TotalAmount" numeric DEFAULT 0 NOT NULL,
    "QuantityReceived" numeric DEFAULT 0 NOT NULL
);
 '   DROP TABLE dbo."InventoryRequestItem";
       dbo         heap    postgres    false    6            �            1259    20298    InventoryRequestRate    TABLE     �  CREATE TABLE dbo."InventoryRequestRate" (
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
       dbo         heap    postgres    false    6            �            1259    20307 /   InventoryRequestRate_InventoryRequestRateId_seq    SEQUENCE       ALTER TABLE dbo."InventoryRequestRate" ALTER COLUMN "InventoryRequestRateId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."InventoryRequestRate_InventoryRequestRateId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    232    6            �            1259    20308 '   InventoryRequest_InventoryRequestId_seq    SEQUENCE     �   ALTER TABLE dbo."InventoryRequest" ALTER COLUMN "InventoryRequestId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."InventoryRequest_InventoryRequestId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    230            �            1259    20309    Item    TABLE     �  CREATE TABLE dbo."Item" (
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
       dbo         heap    postgres    false    6            �            1259    20318 
   ItemBranch    TABLE     �   CREATE TABLE dbo."ItemBranch" (
    "ItemId" bigint NOT NULL,
    "BranchId" bigint NOT NULL,
    "Quantity" bigint DEFAULT 0 NOT NULL
);
    DROP TABLE dbo."ItemBranch";
       dbo         heap    postgres    false    6            �            1259    20322    ItemCategory    TABLE     �   CREATE TABLE dbo."ItemCategory" (
    "ItemCategoryId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "ItemCategoryCode" character varying
);
    DROP TABLE dbo."ItemCategory";
       dbo         heap    postgres    false    6            �            1259    20328    ItemCategory_ItemCategoryId_seq    SEQUENCE     �   ALTER TABLE dbo."ItemCategory" ALTER COLUMN "ItemCategoryId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."ItemCategory_ItemCategoryId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    237            �            1259    20329    ItemWarehouse    TABLE     �   CREATE TABLE dbo."ItemWarehouse" (
    "ItemId" bigint NOT NULL,
    "WarehouseId" bigint NOT NULL,
    "Quantity" bigint DEFAULT 0 NOT NULL,
    "OrderedQuantity" bigint DEFAULT 0 NOT NULL
);
     DROP TABLE dbo."ItemWarehouse";
       dbo         heap    postgres    false    6            �            1259    20334    Item_ItemId_seq    SEQUENCE     �   ALTER TABLE dbo."Item" ALTER COLUMN "ItemId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Item_ItemId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    235    6            �            1259    20335    Notifications    TABLE     �  CREATE TABLE dbo."Notifications" (
    "NotificationId" bigint NOT NULL,
    "Title" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "Type" character varying NOT NULL,
    "ReferenceId" character varying NOT NULL,
    "IsRead" boolean DEFAULT false NOT NULL,
    "UserId" bigint NOT NULL,
    "Date" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL
);
     DROP TABLE dbo."Notifications";
       dbo         heap    postgres    false    6            �            1259    20342     Notifications_NotificationId_seq    SEQUENCE     �   ALTER TABLE dbo."Notifications" ALTER COLUMN "NotificationId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Notifications_NotificationId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    241    6            �            1259    20343    SalesInvoice    TABLE     �  CREATE TABLE dbo."SalesInvoice" (
    "SalesInvoiceId" bigint NOT NULL,
    "SalesInvoiceCode" character varying,
    "SalesDate" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "CreatedByUserId" bigint NOT NULL,
    "BranchId" bigint NOT NULL,
    "TotalAmount" numeric DEFAULT 0 NOT NULL,
    "IsVoid" boolean DEFAULT false NOT NULL,
    "DateLastUpdated" timestamp with time zone
);
    DROP TABLE dbo."SalesInvoice";
       dbo         heap    postgres    false    6            �            1259    20351    SalesInvoiceItem    TABLE     �   CREATE TABLE dbo."SalesInvoiceItem" (
    "SalesInvoiceId" bigint NOT NULL,
    "ItemId" bigint NOT NULL,
    "UnitPrice" numeric DEFAULT 0 NOT NULL,
    "Quantity" numeric DEFAULT 0 NOT NULL,
    "Amount" numeric DEFAULT 0 NOT NULL
);
 #   DROP TABLE dbo."SalesInvoiceItem";
       dbo         heap    postgres    false    6            �            1259    20359    SalesInvoicePayments    TABLE     �   CREATE TABLE dbo."SalesInvoicePayments" (
    "SalesInvoiceId" bigint NOT NULL,
    "PaymentType" character varying NOT NULL,
    "Amount" numeric DEFAULT 0 NOT NULL
);
 '   DROP TABLE dbo."SalesInvoicePayments";
       dbo         heap    postgres    false    6            �            1259    20365    SalesInvoice_SalesInvoiceId_seq    SEQUENCE     �   ALTER TABLE dbo."SalesInvoice" ALTER COLUMN "SalesInvoiceId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."SalesInvoice_SalesInvoiceId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    243    6            �            1259    20366    Supplier    TABLE     �   CREATE TABLE dbo."Supplier" (
    "SupplierId" bigint NOT NULL,
    "SupplierCode" character varying,
    "Name" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."Supplier";
       dbo         heap    postgres    false    6            �            1259    20372    Supplier_SupplierId_seq    SEQUENCE     �   ALTER TABLE dbo."Supplier" ALTER COLUMN "SupplierId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Supplier_SupplierId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    247    6            �            1259    20373    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    6            �            1259    20378    Users    TABLE     t  CREATE TABLE dbo."Users" (
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
       dbo         heap    postgres    false    6            �            1259    20386    Users_UserId_seq    SEQUENCE     �   ALTER TABLE dbo."Users" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    250            �            1259    20387 	   Warehouse    TABLE     �   CREATE TABLE dbo."Warehouse" (
    "WarehouseId" bigint NOT NULL,
    "WarehouseCode" character varying NOT NULL,
    "Name" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."Warehouse";
       dbo         heap    postgres    false    6            �            1259    20393    Warehouse_WarehouseId_seq    SEQUENCE     �   ALTER TABLE dbo."Warehouse" ALTER COLUMN "WarehouseId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Warehouse_WarehouseId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    252    6            �          0    20213    Access 
   TABLE DATA           Z   COPY dbo."Access" ("AccessId", "Name", "AccessPages", "Active", "AccessCode") FROM stdin;
    dbo          postgres    false    215   ��       �          0    20221    Branch 
   TABLE DATA           [   COPY dbo."Branch" ("BranchId", "BranchCode", "Name", "Active", "IsMainBranch") FROM stdin;
    dbo          postgres    false    217   ��       �          0    20229    GatewayConnectedUsers 
   TABLE DATA           J   COPY dbo."GatewayConnectedUsers" ("Id", "SocketId", "UserId") FROM stdin;
    dbo          postgres    false    219   ��       �          0    20233 
   GoodsIssue 
   TABLE DATA           �   COPY dbo."GoodsIssue" ("GoodsIssueId", "GoodsIssueCode", "WarehouseId", "Description", "IssueType", "CreatedByUserId", "DateCreated", "DateLastUpdated", "Status", "Active", "Notes", "LastUpdatedByUserId") FROM stdin;
    dbo          postgres    false    221   �       �          0    20241    GoodsIssueItem 
   TABLE DATA           M   COPY dbo."GoodsIssueItem" ("GoodsIssueId", "ItemId", "Quantity") FROM stdin;
    dbo          postgres    false    222   .�                  0    20248    GoodsReceipt 
   TABLE DATA           �   COPY dbo."GoodsReceipt" ("GoodsReceiptId", "GoodsReceiptCode", "WarehouseId", "Description", "CreatedByUserId", "DateCreated", "DateLastUpdated", "Status", "Active", "Notes", "SupplierId", "LastUpdatedByUserId") FROM stdin;
    dbo          postgres    false    224   K�                 0    20257    GoodsReceiptItem 
   TABLE DATA           Q   COPY dbo."GoodsReceiptItem" ("GoodsReceiptId", "ItemId", "Quantity") FROM stdin;
    dbo          postgres    false    225   h�                 0    20264    InventoryAdjustmentReport 
   TABLE DATA             COPY dbo."InventoryAdjustmentReport" ("InventoryAdjustmentReportId", "InventoryAdjustmentReportCode", "InventoryRequestId", "ReportType", "BranchId", "Description", "ReportedByUserId", "DateReported", "DateLastUpdated", "ReportStatus", "Notes", "Active", "GoodsIssueId") FROM stdin;
    dbo          postgres    false    227   ��                 0    20272    InventoryAdjustmentReportItem 
   TABLE DATA           �   COPY dbo."InventoryAdjustmentReportItem" ("InventoryAdjustmentReportId", "ItemId", "ReturnedQuantity", "ProposedUnitReturnRate", "TotalRefund") FROM stdin;
    dbo          postgres    false    228   ��                 0    20281    InventoryRequest 
   TABLE DATA           �   COPY dbo."InventoryRequest" ("InventoryRequestId", "InventoryRequestCode", "BranchId", "Description", "RequestedByUserId", "DateRequested", "DateLastUpdated", "RequestStatus", "Active", "FromWarehouseId", "Notes", "LastUpdatedByUserId") FROM stdin;
    dbo          postgres    false    230   ��                 0    20290    InventoryRequestItem 
   TABLE DATA           �   COPY dbo."InventoryRequestItem" ("InventoryRequestId", "ItemId", "Quantity", "InventoryRequestRateId", "TotalAmount", "QuantityReceived") FROM stdin;
    dbo          postgres    false    231   ��                 0    20298    InventoryRequestRate 
   TABLE DATA           �   COPY dbo."InventoryRequestRate" ("InventoryRequestRateId", "ItemId", "Rate", "RateName", "MinQuantity", "MaxQuantity", "Active", "BaseRate", "InventoryRequestRateCode") FROM stdin;
    dbo          postgres    false    232   ��                 0    20309    Item 
   TABLE DATA           �   COPY dbo."Item" ("ItemId", "ItemCode", "ItemName", "ItemDescription", "Price", "ItemCategoryId", "DateAdded", "DateLastUpdated", "Active") FROM stdin;
    dbo          postgres    false    235   �                 0    20318 
   ItemBranch 
   TABLE DATA           E   COPY dbo."ItemBranch" ("ItemId", "BranchId", "Quantity") FROM stdin;
    dbo          postgres    false    236   3�                 0    20322    ItemCategory 
   TABLE DATA           l   COPY dbo."ItemCategory" ("ItemCategoryId", "Name", "Description", "Active", "ItemCategoryCode") FROM stdin;
    dbo          postgres    false    237   P�                 0    20329    ItemWarehouse 
   TABLE DATA           ^   COPY dbo."ItemWarehouse" ("ItemId", "WarehouseId", "Quantity", "OrderedQuantity") FROM stdin;
    dbo          postgres    false    239   m�                 0    20335    Notifications 
   TABLE DATA           �   COPY dbo."Notifications" ("NotificationId", "Title", "Description", "Type", "ReferenceId", "IsRead", "UserId", "Date") FROM stdin;
    dbo          postgres    false    241   ��                 0    20343    SalesInvoice 
   TABLE DATA           �   COPY dbo."SalesInvoice" ("SalesInvoiceId", "SalesInvoiceCode", "SalesDate", "CreatedByUserId", "BranchId", "TotalAmount", "IsVoid", "DateLastUpdated") FROM stdin;
    dbo          postgres    false    243   ��                 0    20351    SalesInvoiceItem 
   TABLE DATA           h   COPY dbo."SalesInvoiceItem" ("SalesInvoiceId", "ItemId", "UnitPrice", "Quantity", "Amount") FROM stdin;
    dbo          postgres    false    244   ��                 0    20359    SalesInvoicePayments 
   TABLE DATA           X   COPY dbo."SalesInvoicePayments" ("SalesInvoiceId", "PaymentType", "Amount") FROM stdin;
    dbo          postgres    false    245   ��                 0    20366    Supplier 
   TABLE DATA           Q   COPY dbo."Supplier" ("SupplierId", "SupplierCode", "Name", "Active") FROM stdin;
    dbo          postgres    false    247   ��                 0    20373    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    249                    0    20378    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "UserName", "Password", "FullName", "Gender", "BirthDate", "MobileNumber", "Email", "AccessGranted", "AccessId", "Active", "UserCode", "Address", "BranchId") FROM stdin;
    dbo          postgres    false    250   8                 0    20387 	   Warehouse 
   TABLE DATA           T   COPY dbo."Warehouse" ("WarehouseId", "WarehouseCode", "Name", "Active") FROM stdin;
    dbo          postgres    false    252   �       $           0    0    Access_AccessId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Access_AccessId_seq"', 1, true);
          dbo          postgres    false    216            %           0    0    Branch_BranchId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Branch_BranchId_seq"', 1, true);
          dbo          postgres    false    218            &           0    0    GatewayConnectedUsers_Id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('dbo."GatewayConnectedUsers_Id_seq"', 1, false);
          dbo          postgres    false    220            '           0    0    GoodsIssue_GoodsIssueId_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('dbo."GoodsIssue_GoodsIssueId_seq"', 1, false);
          dbo          postgres    false    223            (           0    0    GoodsReceipt_GoodsReceiptId_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('dbo."GoodsReceipt_GoodsReceiptId_seq"', 1, false);
          dbo          postgres    false    226            )           0    0 9   InventoryAdjustmentReport_InventoryAdjustmentReportId_seq    SEQUENCE SET     g   SELECT pg_catalog.setval('dbo."InventoryAdjustmentReport_InventoryAdjustmentReportId_seq"', 1, false);
          dbo          postgres    false    229            *           0    0 /   InventoryRequestRate_InventoryRequestRateId_seq    SEQUENCE SET     ]   SELECT pg_catalog.setval('dbo."InventoryRequestRate_InventoryRequestRateId_seq"', 1, false);
          dbo          postgres    false    233            +           0    0 '   InventoryRequest_InventoryRequestId_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('dbo."InventoryRequest_InventoryRequestId_seq"', 1, false);
          dbo          postgres    false    234            ,           0    0    ItemCategory_ItemCategoryId_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('dbo."ItemCategory_ItemCategoryId_seq"', 1, false);
          dbo          postgres    false    238            -           0    0    Item_ItemId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Item_ItemId_seq"', 1, false);
          dbo          postgres    false    240            .           0    0     Notifications_NotificationId_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('dbo."Notifications_NotificationId_seq"', 1, false);
          dbo          postgres    false    242            /           0    0    SalesInvoice_SalesInvoiceId_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('dbo."SalesInvoice_SalesInvoiceId_seq"', 1, false);
          dbo          postgres    false    246            0           0    0    Supplier_SupplierId_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('dbo."Supplier_SupplierId_seq"', 1, false);
          dbo          postgres    false    248            1           0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 1, true);
          dbo          postgres    false    251            2           0    0    Warehouse_WarehouseId_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('dbo."Warehouse_WarehouseId_seq"', 1, true);
          dbo          postgres    false    253                       2606    20395    Access Access_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Access"
    ADD CONSTRAINT "Access_pkey" PRIMARY KEY ("AccessId");
 =   ALTER TABLE ONLY dbo."Access" DROP CONSTRAINT "Access_pkey";
       dbo            postgres    false    215                       2606    20397    Branch Branch_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Branch"
    ADD CONSTRAINT "Branch_pkey" PRIMARY KEY ("BranchId");
 =   ALTER TABLE ONLY dbo."Branch" DROP CONSTRAINT "Branch_pkey";
       dbo            postgres    false    217                       2606    20399 "   GoodsIssueItem GoodsIssueItem_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY dbo."GoodsIssueItem"
    ADD CONSTRAINT "GoodsIssueItem_pkey" PRIMARY KEY ("GoodsIssueId", "ItemId");
 M   ALTER TABLE ONLY dbo."GoodsIssueItem" DROP CONSTRAINT "GoodsIssueItem_pkey";
       dbo            postgres    false    222    222                       2606    20401    GoodsIssue GoodsIssue_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY dbo."GoodsIssue"
    ADD CONSTRAINT "GoodsIssue_pkey" PRIMARY KEY ("GoodsIssueId");
 E   ALTER TABLE ONLY dbo."GoodsIssue" DROP CONSTRAINT "GoodsIssue_pkey";
       dbo            postgres    false    221                       2606    20403 &   GoodsReceiptItem GoodsReceiptItem_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY dbo."GoodsReceiptItem"
    ADD CONSTRAINT "GoodsReceiptItem_pkey" PRIMARY KEY ("GoodsReceiptId", "ItemId");
 Q   ALTER TABLE ONLY dbo."GoodsReceiptItem" DROP CONSTRAINT "GoodsReceiptItem_pkey";
       dbo            postgres    false    225    225                       2606    20405    GoodsReceipt GoodsReceipt_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."GoodsReceipt"
    ADD CONSTRAINT "GoodsReceipt_pkey" PRIMARY KEY ("GoodsReceiptId");
 I   ALTER TABLE ONLY dbo."GoodsReceipt" DROP CONSTRAINT "GoodsReceipt_pkey";
       dbo            postgres    false    224                       2606    20407 @   InventoryAdjustmentReportItem InventoryAdjustmentReportItem_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryAdjustmentReportItem"
    ADD CONSTRAINT "InventoryAdjustmentReportItem_pkey" PRIMARY KEY ("InventoryAdjustmentReportId", "ItemId");
 k   ALTER TABLE ONLY dbo."InventoryAdjustmentReportItem" DROP CONSTRAINT "InventoryAdjustmentReportItem_pkey";
       dbo            postgres    false    228    228                       2606    20409 8   InventoryAdjustmentReport InventoryAdjustmentReport_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryAdjustmentReport"
    ADD CONSTRAINT "InventoryAdjustmentReport_pkey" PRIMARY KEY ("InventoryAdjustmentReportId");
 c   ALTER TABLE ONLY dbo."InventoryAdjustmentReport" DROP CONSTRAINT "InventoryAdjustmentReport_pkey";
       dbo            postgres    false    227                       2606    20411 .   InventoryRequestItem InventoryRequestItem_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequestItem"
    ADD CONSTRAINT "InventoryRequestItem_pkey" PRIMARY KEY ("InventoryRequestId", "ItemId");
 Y   ALTER TABLE ONLY dbo."InventoryRequestItem" DROP CONSTRAINT "InventoryRequestItem_pkey";
       dbo            postgres    false    231    231                       2606    20413 .   InventoryRequestRate InventoryRequestRate_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequestRate"
    ADD CONSTRAINT "InventoryRequestRate_pkey" PRIMARY KEY ("InventoryRequestRateId");
 Y   ALTER TABLE ONLY dbo."InventoryRequestRate" DROP CONSTRAINT "InventoryRequestRate_pkey";
       dbo            postgres    false    232                       2606    20415 &   InventoryRequest InventoryRequest_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY dbo."InventoryRequest"
    ADD CONSTRAINT "InventoryRequest_pkey" PRIMARY KEY ("InventoryRequestId");
 Q   ALTER TABLE ONLY dbo."InventoryRequest" DROP CONSTRAINT "InventoryRequest_pkey";
       dbo            postgres    false    230            &           2606    20417    ItemBranch ItemBranch_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."ItemBranch"
    ADD CONSTRAINT "ItemBranch_pkey" PRIMARY KEY ("BranchId", "ItemId");
 E   ALTER TABLE ONLY dbo."ItemBranch" DROP CONSTRAINT "ItemBranch_pkey";
       dbo            postgres    false    236    236            (           2606    20419    ItemCategory ItemCategory_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."ItemCategory"
    ADD CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("ItemCategoryId");
 I   ALTER TABLE ONLY dbo."ItemCategory" DROP CONSTRAINT "ItemCategory_pkey";
       dbo            postgres    false    237            +           2606    20421     ItemWarehouse ItemWarehouse_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY dbo."ItemWarehouse"
    ADD CONSTRAINT "ItemWarehouse_pkey" PRIMARY KEY ("WarehouseId", "ItemId");
 K   ALTER TABLE ONLY dbo."ItemWarehouse" DROP CONSTRAINT "ItemWarehouse_pkey";
       dbo            postgres    false    239    239            "           2606    20423    Item Item_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY dbo."Item"
    ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("ItemId");
 9   ALTER TABLE ONLY dbo."Item" DROP CONSTRAINT "Item_pkey";
       dbo            postgres    false    235            -           2606    20425     Notifications Notifications_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY ("NotificationId");
 K   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT "Notifications_pkey";
       dbo            postgres    false    241            1           2606    20427 &   SalesInvoiceItem SalesInvoiceItem_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY dbo."SalesInvoiceItem"
    ADD CONSTRAINT "SalesInvoiceItem_pkey" PRIMARY KEY ("SalesInvoiceId", "ItemId");
 Q   ALTER TABLE ONLY dbo."SalesInvoiceItem" DROP CONSTRAINT "SalesInvoiceItem_pkey";
       dbo            postgres    false    244    244            3           2606    20429 .   SalesInvoicePayments SalesInvoicePayments_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."SalesInvoicePayments"
    ADD CONSTRAINT "SalesInvoicePayments_pkey" PRIMARY KEY ("SalesInvoiceId", "PaymentType");
 Y   ALTER TABLE ONLY dbo."SalesInvoicePayments" DROP CONSTRAINT "SalesInvoicePayments_pkey";
       dbo            postgres    false    245    245            /           2606    20431    SalesInvoice SalesInvoice_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."SalesInvoice"
    ADD CONSTRAINT "SalesInvoice_pkey" PRIMARY KEY ("SalesInvoiceId");
 I   ALTER TABLE ONLY dbo."SalesInvoice" DROP CONSTRAINT "SalesInvoice_pkey";
       dbo            postgres    false    243            5           2606    20433    Supplier Supplier_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY dbo."Supplier"
    ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY ("SupplierId");
 A   ALTER TABLE ONLY dbo."Supplier" DROP CONSTRAINT "Supplier_pkey";
       dbo            postgres    false    247            8           2606    20435    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    249            ?           2606    20437    Warehouse Warehouse_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY dbo."Warehouse"
    ADD CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("WarehouseId");
 C   ALTER TABLE ONLY dbo."Warehouse" DROP CONSTRAINT "Warehouse_pkey";
       dbo            postgres    false    252                       2606    20439 8   GatewayConnectedUsers pk_gatewayconnectedusers_933578364 
   CONSTRAINT     w   ALTER TABLE ONLY dbo."GatewayConnectedUsers"
    ADD CONSTRAINT pk_gatewayconnectedusers_933578364 PRIMARY KEY ("Id");
 a   ALTER TABLE ONLY dbo."GatewayConnectedUsers" DROP CONSTRAINT pk_gatewayconnectedusers_933578364;
       dbo            postgres    false    219            :           2606    20441    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    250            	           1259    20442    u_branch_branchCode    INDEX     �   CREATE UNIQUE INDEX "u_branch_branchCode" ON dbo."Branch" USING btree ("BranchCode", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
 &   DROP INDEX dbo."u_branch_branchCode";
       dbo            postgres    false    217    217    217            
           1259    20443    u_branch_name    INDEX     �   CREATE UNIQUE INDEX u_branch_name ON dbo."Branch" USING btree ("Name", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_branch_name;
       dbo            postgres    false    217    217    217                       1259    20444    u_inventoryrequestrate    INDEX     �   CREATE UNIQUE INDEX u_inventoryrequestrate ON dbo."InventoryRequestRate" USING btree ("RateName", "ItemId", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
 '   DROP INDEX dbo.u_inventoryrequestrate;
       dbo            postgres    false    232    232    232    232                        1259    20445    u_inventoryrequestrate_rate    INDEX     �   CREATE UNIQUE INDEX u_inventoryrequestrate_rate ON dbo."InventoryRequestRate" USING btree ("ItemId", "Rate", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
 ,   DROP INDEX dbo.u_inventoryrequestrate_rate;
       dbo            postgres    false    232    232    232    232            #           1259    20446    u_item_itemCode    INDEX     �   CREATE UNIQUE INDEX "u_item_itemCode" ON dbo."Item" USING btree ("ItemCode", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
 "   DROP INDEX dbo."u_item_itemCode";
       dbo            postgres    false    235    235    235            $           1259    20447    u_item_itemName    INDEX     �   CREATE UNIQUE INDEX "u_item_itemName" ON dbo."Item" USING btree ("ItemName", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
 "   DROP INDEX dbo."u_item_itemName";
       dbo            postgres    false    235    235    235            )           1259    20448    u_itemcategory    INDEX     �   CREATE UNIQUE INDEX u_itemcategory ON dbo."ItemCategory" USING btree ("Name", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_itemcategory;
       dbo            postgres    false    237    237    237            6           1259    20449    u_supplier_name    INDEX     �   CREATE UNIQUE INDEX u_supplier_name ON dbo."Supplier" USING btree ("Name", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
     DROP INDEX dbo.u_supplier_name;
       dbo            postgres    false    247    247    247            ;           1259    20450    u_user    INDEX     �   CREATE UNIQUE INDEX u_user ON dbo."Users" USING btree ("UserName", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_user;
       dbo            postgres    false    250    250    250            <           1259    20451    u_user_email    INDEX     �   CREATE UNIQUE INDEX u_user_email ON dbo."Users" USING btree ("Email", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_user_email;
       dbo            postgres    false    250    250    250            =           1259    20452    u_user_number    INDEX     �   CREATE UNIQUE INDEX u_user_number ON dbo."Users" USING btree ("MobileNumber", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_user_number;
       dbo            postgres    false    250    250    250            @           1259    20453    u_warehouse_name    INDEX     �   CREATE UNIQUE INDEX u_warehouse_name ON dbo."Warehouse" USING btree ("Name", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
 !   DROP INDEX dbo.u_warehouse_name;
       dbo            postgres    false    252    252    252            A           1259    20454    u_warehouse_warehouseCode    INDEX     �   CREATE UNIQUE INDEX "u_warehouse_warehouseCode" ON dbo."Warehouse" USING btree ("WarehouseCode", "Active") WITH (deduplicate_items='false') WHERE ("Active" = true);
 ,   DROP INDEX dbo."u_warehouse_warehouseCode";
       dbo            postgres    false    252    252    252            B           2606    20455 3   GatewayConnectedUsers fk_GatewayConnectedUsers_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GatewayConnectedUsers"
    ADD CONSTRAINT "fk_GatewayConnectedUsers_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 ^   ALTER TABLE ONLY dbo."GatewayConnectedUsers" DROP CONSTRAINT "fk_GatewayConnectedUsers_User";
       dbo          postgres    false    250    3386    219            g           2606    20460    Users fk_User_Access    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT "fk_User_Access" FOREIGN KEY ("AccessId") REFERENCES dbo."Access"("AccessId") NOT VALID;
 ?   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT "fk_User_Access";
       dbo          postgres    false    215    3334    250            N           2606    20465 4   InventoryAdjustmentReport fk_adjustmentreport_branch    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryAdjustmentReport"
    ADD CONSTRAINT fk_adjustmentreport_branch FOREIGN KEY ("BranchId") REFERENCES dbo."Branch"("BranchId") NOT VALID;
 ]   ALTER TABLE ONLY dbo."InventoryAdjustmentReport" DROP CONSTRAINT fk_adjustmentreport_branch;
       dbo          postgres    false    3336    227    217            O           2606    20470 8   InventoryAdjustmentReport fk_adjustmentreport_goodsissue    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryAdjustmentReport"
    ADD CONSTRAINT fk_adjustmentreport_goodsissue FOREIGN KEY ("GoodsIssueId") REFERENCES dbo."GoodsIssue"("GoodsIssueId") NOT VALID;
 a   ALTER TABLE ONLY dbo."InventoryAdjustmentReport" DROP CONSTRAINT fk_adjustmentreport_goodsissue;
       dbo          postgres    false    221    227    3342            P           2606    20475 >   InventoryAdjustmentReport fk_adjustmentreport_inventoryrequest    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryAdjustmentReport"
    ADD CONSTRAINT fk_adjustmentreport_inventoryrequest FOREIGN KEY ("InventoryRequestId") REFERENCES dbo."InventoryRequest"("InventoryRequestId") NOT VALID;
 g   ALTER TABLE ONLY dbo."InventoryAdjustmentReport" DROP CONSTRAINT fk_adjustmentreport_inventoryrequest;
       dbo          postgres    false    230    227    3354            Q           2606    20480 <   InventoryAdjustmentReport fk_adjustmentreport_reportedbyuser    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryAdjustmentReport"
    ADD CONSTRAINT fk_adjustmentreport_reportedbyuser FOREIGN KEY ("ReportedByUserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 e   ALTER TABLE ONLY dbo."InventoryAdjustmentReport" DROP CONSTRAINT fk_adjustmentreport_reportedbyuser;
       dbo          postgres    false    3386    227    250            R           2606    20485 F   InventoryAdjustmentReportItem fk_adjustmentreportitem_adjustmentreport    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryAdjustmentReportItem"
    ADD CONSTRAINT fk_adjustmentreportitem_adjustmentreport FOREIGN KEY ("InventoryAdjustmentReportId") REFERENCES dbo."InventoryAdjustmentReport"("InventoryAdjustmentReportId");
 o   ALTER TABLE ONLY dbo."InventoryAdjustmentReportItem" DROP CONSTRAINT fk_adjustmentreportitem_adjustmentreport;
       dbo          postgres    false    228    227    3350            S           2606    20490 :   InventoryAdjustmentReportItem fk_adjustmentreportitem_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryAdjustmentReportItem"
    ADD CONSTRAINT fk_adjustmentreportitem_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 c   ALTER TABLE ONLY dbo."InventoryAdjustmentReportItem" DROP CONSTRAINT fk_adjustmentreportitem_item;
       dbo          postgres    false    3362    228    235            C           2606    20495 (   GoodsIssue fk_goodsissue_createdbyuserid    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsIssue"
    ADD CONSTRAINT fk_goodsissue_createdbyuserid FOREIGN KEY ("CreatedByUserId") REFERENCES dbo."Users"("UserId");
 Q   ALTER TABLE ONLY dbo."GoodsIssue" DROP CONSTRAINT fk_goodsissue_createdbyuserid;
       dbo          postgres    false    250    221    3386            D           2606    20500 "   GoodsIssue fk_goodsissue_warehouse    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsIssue"
    ADD CONSTRAINT fk_goodsissue_warehouse FOREIGN KEY ("WarehouseId") REFERENCES dbo."Warehouse"("WarehouseId");
 K   ALTER TABLE ONLY dbo."GoodsIssue" DROP CONSTRAINT fk_goodsissue_warehouse;
       dbo          postgres    false    3391    221    252            F           2606    20505 +   GoodsIssueItem fk_goodsissueitem_goodsissue    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsIssueItem"
    ADD CONSTRAINT fk_goodsissueitem_goodsissue FOREIGN KEY ("GoodsIssueId") REFERENCES dbo."GoodsIssue"("GoodsIssueId");
 T   ALTER TABLE ONLY dbo."GoodsIssueItem" DROP CONSTRAINT fk_goodsissueitem_goodsissue;
       dbo          postgres    false    221    222    3342            G           2606    20510 %   GoodsIssueItem fk_goodsissueitem_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsIssueItem"
    ADD CONSTRAINT fk_goodsissueitem_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 N   ALTER TABLE ONLY dbo."GoodsIssueItem" DROP CONSTRAINT fk_goodsissueitem_item;
       dbo          postgres    false    222    235    3362            H           2606    20515 ,   GoodsReceipt fk_goodsreceipt_createdbyuserid    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsReceipt"
    ADD CONSTRAINT fk_goodsreceipt_createdbyuserid FOREIGN KEY ("CreatedByUserId") REFERENCES dbo."Users"("UserId");
 U   ALTER TABLE ONLY dbo."GoodsReceipt" DROP CONSTRAINT fk_goodsreceipt_createdbyuserid;
       dbo          postgres    false    224    3386    250            I           2606    20520 %   GoodsReceipt fk_goodsreceipt_supplier    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsReceipt"
    ADD CONSTRAINT fk_goodsreceipt_supplier FOREIGN KEY ("SupplierId") REFERENCES dbo."Supplier"("SupplierId") NOT VALID;
 N   ALTER TABLE ONLY dbo."GoodsReceipt" DROP CONSTRAINT fk_goodsreceipt_supplier;
       dbo          postgres    false    3381    224    247            J           2606    20525 &   GoodsReceipt fk_goodsreceipt_warehouse    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsReceipt"
    ADD CONSTRAINT fk_goodsreceipt_warehouse FOREIGN KEY ("WarehouseId") REFERENCES dbo."Warehouse"("WarehouseId");
 O   ALTER TABLE ONLY dbo."GoodsReceipt" DROP CONSTRAINT fk_goodsreceipt_warehouse;
       dbo          postgres    false    224    252    3391            L           2606    20530 1   GoodsReceiptItem fk_goodsreceiptitem_goodsreceipt    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsReceiptItem"
    ADD CONSTRAINT fk_goodsreceiptitem_goodsreceipt FOREIGN KEY ("GoodsReceiptId") REFERENCES dbo."GoodsReceipt"("GoodsReceiptId");
 Z   ALTER TABLE ONLY dbo."GoodsReceiptItem" DROP CONSTRAINT fk_goodsreceiptitem_goodsreceipt;
       dbo          postgres    false    3346    224    225            M           2606    20535 )   GoodsReceiptItem fk_goodsreceiptitem_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsReceiptItem"
    ADD CONSTRAINT fk_goodsreceiptitem_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 R   ALTER TABLE ONLY dbo."GoodsReceiptItem" DROP CONSTRAINT fk_goodsreceiptitem_item;
       dbo          postgres    false    235    3362    225            [           2606    20540 1   InventoryRequestRate fk_inventoryRequestrate_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequestRate"
    ADD CONSTRAINT "fk_inventoryRequestrate_item" FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 \   ALTER TABLE ONLY dbo."InventoryRequestRate" DROP CONSTRAINT "fk_inventoryRequestrate_item";
       dbo          postgres    false    3362    235    232            T           2606    20545 +   InventoryRequest fk_inventoryrequest_branch    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequest"
    ADD CONSTRAINT fk_inventoryrequest_branch FOREIGN KEY ("BranchId") REFERENCES dbo."Branch"("BranchId");
 T   ALTER TABLE ONLY dbo."InventoryRequest" DROP CONSTRAINT fk_inventoryrequest_branch;
       dbo          postgres    false    230    217    3336            U           2606    20550 4   InventoryRequest fk_inventoryrequest_fromwarehouseid    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequest"
    ADD CONSTRAINT fk_inventoryrequest_fromwarehouseid FOREIGN KEY ("FromWarehouseId") REFERENCES dbo."Warehouse"("WarehouseId") NOT VALID;
 ]   ALTER TABLE ONLY dbo."InventoryRequest" DROP CONSTRAINT fk_inventoryrequest_fromwarehouseid;
       dbo          postgres    false    230    252    3391            V           2606    20555 6   InventoryRequest fk_inventoryrequest_lastupdatedbyuser    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequest"
    ADD CONSTRAINT fk_inventoryrequest_lastupdatedbyuser FOREIGN KEY ("LastUpdatedByUserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 _   ALTER TABLE ONLY dbo."InventoryRequest" DROP CONSTRAINT fk_inventoryrequest_lastupdatedbyuser;
       dbo          postgres    false    230    3386    250            W           2606    20560 6   InventoryRequest fk_inventoryrequest_requestedbyuserId    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequest"
    ADD CONSTRAINT "fk_inventoryrequest_requestedbyuserId" FOREIGN KEY ("RequestedByUserId") REFERENCES dbo."Users"("UserId");
 a   ALTER TABLE ONLY dbo."InventoryRequest" DROP CONSTRAINT "fk_inventoryrequest_requestedbyuserId";
       dbo          postgres    false    250    230    3386            X           2606    20565 =   InventoryRequestItem fk_inventoryrequestitem_inventoryrequest    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequestItem"
    ADD CONSTRAINT fk_inventoryrequestitem_inventoryrequest FOREIGN KEY ("InventoryRequestId") REFERENCES dbo."InventoryRequest"("InventoryRequestId");
 f   ALTER TABLE ONLY dbo."InventoryRequestItem" DROP CONSTRAINT fk_inventoryrequestitem_inventoryrequest;
       dbo          postgres    false    231    230    3354            Y           2606    20570 C   InventoryRequestItem fk_inventoryrequestitem_inventoryrequestrateId    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequestItem"
    ADD CONSTRAINT "fk_inventoryrequestitem_inventoryrequestrateId" FOREIGN KEY ("InventoryRequestRateId") REFERENCES dbo."InventoryRequestRate"("InventoryRequestRateId") NOT VALID;
 n   ALTER TABLE ONLY dbo."InventoryRequestItem" DROP CONSTRAINT "fk_inventoryrequestitem_inventoryrequestrateId";
       dbo          postgres    false    231    232    3358            Z           2606    20575 1   InventoryRequestItem fk_inventoryrequestitem_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."InventoryRequestItem"
    ADD CONSTRAINT fk_inventoryrequestitem_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 Z   ALTER TABLE ONLY dbo."InventoryRequestItem" DROP CONSTRAINT fk_inventoryrequestitem_item;
       dbo          postgres    false    3362    231    235            \           2606    20580    Item fk_item_itemcategory    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Item"
    ADD CONSTRAINT fk_item_itemcategory FOREIGN KEY ("ItemCategoryId") REFERENCES dbo."ItemCategory"("ItemCategoryId");
 B   ALTER TABLE ONLY dbo."Item" DROP CONSTRAINT fk_item_itemcategory;
       dbo          postgres    false    237    3368    235            ]           2606    20585    ItemBranch fk_itembranch_branch    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ItemBranch"
    ADD CONSTRAINT fk_itembranch_branch FOREIGN KEY ("BranchId") REFERENCES dbo."Branch"("BranchId");
 H   ALTER TABLE ONLY dbo."ItemBranch" DROP CONSTRAINT fk_itembranch_branch;
       dbo          postgres    false    236    217    3336            ^           2606    20590    ItemBranch fk_itembranch_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ItemBranch"
    ADD CONSTRAINT fk_itembranch_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 F   ALTER TABLE ONLY dbo."ItemBranch" DROP CONSTRAINT fk_itembranch_item;
       dbo          postgres    false    3362    236    235            _           2606    20595 #   ItemWarehouse fk_itemwarehouse_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ItemWarehouse"
    ADD CONSTRAINT fk_itemwarehouse_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId") NOT VALID;
 L   ALTER TABLE ONLY dbo."ItemWarehouse" DROP CONSTRAINT fk_itemwarehouse_item;
       dbo          postgres    false    3362    239    235            `           2606    20600 (   ItemWarehouse fk_itemwarehouse_warehouse    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."ItemWarehouse"
    ADD CONSTRAINT fk_itemwarehouse_warehouse FOREIGN KEY ("WarehouseId") REFERENCES dbo."Warehouse"("WarehouseId") NOT VALID;
 Q   ALTER TABLE ONLY dbo."ItemWarehouse" DROP CONSTRAINT fk_itemwarehouse_warehouse;
       dbo          postgres    false    252    3391    239            K           2606    20605 &   GoodsReceipt fk_lastupdatedbyuser_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsReceipt"
    ADD CONSTRAINT fk_lastupdatedbyuser_user FOREIGN KEY ("LastUpdatedByUserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 O   ALTER TABLE ONLY dbo."GoodsReceipt" DROP CONSTRAINT fk_lastupdatedbyuser_user;
       dbo          postgres    false    224    250    3386            E           2606    20610 $   GoodsIssue fk_lastupdatedbyuser_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."GoodsIssue"
    ADD CONSTRAINT fk_lastupdatedbyuser_user FOREIGN KEY ("LastUpdatedByUserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 M   ALTER TABLE ONLY dbo."GoodsIssue" DROP CONSTRAINT fk_lastupdatedbyuser_user;
       dbo          postgres    false    250    3386    221            a           2606    20615 #   Notifications fk_notifications_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 L   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT fk_notifications_user;
       dbo          postgres    false    250    241    3386            b           2606    20620 %   SalesInvoice fk_salesinvoice_branchid    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SalesInvoice"
    ADD CONSTRAINT fk_salesinvoice_branchid FOREIGN KEY ("BranchId") REFERENCES dbo."Branch"("BranchId");
 N   ALTER TABLE ONLY dbo."SalesInvoice" DROP CONSTRAINT fk_salesinvoice_branchid;
       dbo          postgres    false    243    217    3336            c           2606    20625 ,   SalesInvoice fk_salesinvoice_createdbyuserId    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SalesInvoice"
    ADD CONSTRAINT "fk_salesinvoice_createdbyuserId" FOREIGN KEY ("CreatedByUserId") REFERENCES dbo."Users"("UserId");
 W   ALTER TABLE ONLY dbo."SalesInvoice" DROP CONSTRAINT "fk_salesinvoice_createdbyuserId";
       dbo          postgres    false    250    243    3386            f           2606    20630 1   SalesInvoicePayments fk_salesinvoice_salesinvoice    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SalesInvoicePayments"
    ADD CONSTRAINT fk_salesinvoice_salesinvoice FOREIGN KEY ("SalesInvoiceId") REFERENCES dbo."SalesInvoice"("SalesInvoiceId");
 Z   ALTER TABLE ONLY dbo."SalesInvoicePayments" DROP CONSTRAINT fk_salesinvoice_salesinvoice;
       dbo          postgres    false    243    245    3375            d           2606    20635 )   SalesInvoiceItem fk_salesinvoiceitem_item    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SalesInvoiceItem"
    ADD CONSTRAINT fk_salesinvoiceitem_item FOREIGN KEY ("ItemId") REFERENCES dbo."Item"("ItemId");
 R   ALTER TABLE ONLY dbo."SalesInvoiceItem" DROP CONSTRAINT fk_salesinvoiceitem_item;
       dbo          postgres    false    235    3362    244            e           2606    20640 1   SalesInvoiceItem fk_salesinvoiceitem_salesinvoice    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SalesInvoiceItem"
    ADD CONSTRAINT fk_salesinvoiceitem_salesinvoice FOREIGN KEY ("SalesInvoiceId") REFERENCES dbo."SalesInvoice"("SalesInvoiceId");
 Z   ALTER TABLE ONLY dbo."SalesInvoiceItem" DROP CONSTRAINT fk_salesinvoiceitem_salesinvoice;
       dbo          postgres    false    3375    244    243            h           2606    20645    Users fk_user_branch    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT fk_user_branch FOREIGN KEY ("BranchId") REFERENCES dbo."Branch"("BranchId") NOT VALID;
 =   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT fk_user_branch;
       dbo          postgres    false    250    3336    217            �     x�ŕ�j�0���S��X��e�v�(;�=x���$�+�e���n��0���$K���,�ˬ�{c��֊��8BH��B>)n�QQ-��`�#f=�{����G�L�z�����Z�'��Z��X�tJp�/�=Pg��EPԇ���'Q�CJ2�_���7h��F� �/Cc|+����Uu�g4�J?#���`�TU��9�Au�&��9LU����>��EE�R��k��yp�3@3�QŦ�ex$eu�Vs�@��O�xz�_g����l�|{���7�[j      �      x�3��u��s
r�s�@f�p�p��qqq ���      �      x������ � �      �      x������ � �      �      x������ � �             x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �         �   x�3�LL����T1JR14P�)�3ήJKO��0Hs�rK1IM	u+�0�)5O���Huqq�-��v-t�J�+�H�t� &9�]�\\�8---t�u-8��ML�8Ss3s�A�^r~.g	�!��!��#�!W� oN(k         $   x�3�tqus�	�wr��v�"R����� -�     