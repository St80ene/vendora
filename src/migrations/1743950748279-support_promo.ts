import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class SupportPromo1743950748279 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'promo_codes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'code',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'value',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['percentage', 'fixed'],
          },
          {
            name: 'applies_to_product_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'applies_to_category_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expires_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('promo_codes');
  }
}
