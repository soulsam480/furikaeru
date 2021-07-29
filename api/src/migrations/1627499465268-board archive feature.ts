import {MigrationInterface, QueryRunner} from "typeorm";

export class boardArchiveFeature1627499465268 implements MigrationInterface {
    name = 'boardArchiveFeature1627499465268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" ADD "is_deleted" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "is_deleted"`);
    }

}
