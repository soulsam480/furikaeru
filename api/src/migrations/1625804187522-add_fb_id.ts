import {MigrationInterface, QueryRunner} from "typeorm";

export class addFbId1625804187522 implements MigrationInterface {
    name = 'addFbId1625804187522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "fb_id" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_b627ec4983d85cdab95fed4819c" UNIQUE ("fb_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_b627ec4983d85cdab95fed4819c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fb_id"`);
    }

}
