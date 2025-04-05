import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class InitialDatabaseSetup1743485615183 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users Table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'enum',
            enum: [
              'admin',
              'seller',
              'customer',
              'super_admin',
              'moderator',
              'delivery_agent',
            ],
            default: "'customer'",
          },
          { name: 'avatar', type: 'varchar', length: '500', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      })
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({ name: 'IDX_USERS_EMAIL', columnNames: ['email'] })
    );

    // addresses
    await queryRunner.query(`CREATE TABLE \`addresses\` (
  \`id\` CHAR(36) NOT NULL,
  \`phone\` VARCHAR(20) NOT NULL,
  \`street\` VARCHAR(255) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`state\` VARCHAR(100) NOT NULL,
  \`country\` VARCHAR(100) NOT NULL,
  \`zip_code\` VARCHAR(20) NOT NULL,
  \`is_default\` TINYINT(1) NULL DEFAULT 0,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  \`user_id\` CHAR(36) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB`);

    await queryRunner.createForeignKey(
      'addresses',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'addresses',
      new TableIndex({
        name: 'IDX_USER_ADDRESS',
        columnNames: ['user_id'],
        isUnique: false,
      })
    );

    // categories
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'name', type: 'varchar', length: '500', isUnique: true },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      })
    );

    // products
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'name', type: 'varchar', length: '255', isUnique: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'price', type: 'decimal', precision: 10, scale: 2 },
          { name: 'stock', type: 'int', default: '0' },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'out_of_stock', 'discontinued'],
            default: "'active'",
          },
          { name: 'category_id', type: 'varchar', length: '36' },
          { name: 'user_id', type: 'varchar', length: '36' },
          {
            name: 'image_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['category_id'],
            referencedTableName: 'categories',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      })
    );

    //  orders
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'user_id', type: 'varchar', length: '36' },
          { name: 'status', type: 'varchar', length: '50' },
          {
            name: 'payment_status',
            type: 'enum',
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: "'pending'",
          },
          {
            name: 'shipping_cost',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: '0.0',
          },
          {
            name: 'discount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: '0.0',
          },
          {
            name: 'total',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: '0.0',
          },
          {
            name: 'grand_total',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: '0.0',
          },
          {
            name: 'address_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['address_id'],
            referencedTableName: 'addresses',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      })
    );

    // order items
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'order_id', type: 'varchar', length: '36' },
          { name: 'product_id', type: 'varchar', length: '36' },
          { name: 'price', type: 'decimal', precision: 10, scale: 2 },
          { name: 'quantity', type: 'int', default: '1' },
          {
            name: 'total',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: '0.0',
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['order_id'],
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      })
    );

    // payments
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'order_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'payment_method',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'transaction_reference',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'paid_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      })
    );

    // shipments
    await queryRunner.createTable(
      new Table({
        name: 'shipments',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'order_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'tracking_number',
            type: 'int',
            isUnique: true,
          },
          { name: 'photo', type: 'varchar', length: '500', isNullable: true },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: `'pending'`,
          },
          {
            name: 'courier',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'shipped_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'delivered_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'address_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'shipments',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'shipments',
      new TableForeignKey({
        columnNames: ['address_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'addresses',
        onDelete: 'CASCADE',
      })
    );

    // reviews
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'product_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'rating',
            type: 'int',
            isNullable: false,
            unsigned: true,
          },
          {
            name: 'comment',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'reviews',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'reviews',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.dropForeignKey('addresses', 'FK_addresses_userId');
    await queryRunner.dropForeignKey('carts', 'FK_carts_userId');
    await queryRunner.dropForeignKey('products', 'FK_products_category_id');
    await queryRunner.dropForeignKey('products', 'FK_products_user_id');
    await queryRunner.dropForeignKey('orders', 'FK_orders_user_id');
    await queryRunner.dropForeignKey('order_items', 'FK_order_items_order_id');
    await queryRunner.dropForeignKey(
      'order_items',
      'FK_order_items_product_id'
    );
    await queryRunner.dropForeignKey('shipments', 'FK_shipments_orderId');
    await queryRunner.dropForeignKey('shipments', 'FK_shipments_addressId');
    await queryRunner.dropForeignKey('reviews', 'FK_reviews_userId');
    await queryRunner.dropForeignKey('reviews', 'FK_reviews_productId');
    await queryRunner.dropForeignKey('payments', 'FK_payments_orderId');

    await queryRunner.query(`
            DROP TABLE IF EXISTS reviews;
            DROP TABLE IF EXISTS shipments;
            DROP TABLE IF EXISTS payments;
            DROP TABLE IF EXISTS order_items;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS categories;
            DROP TABLE IF EXISTS carts;
            DROP TABLE IF EXISTS addresses;
            DROP TABLE IF EXISTS users;
        `);
  }
}
