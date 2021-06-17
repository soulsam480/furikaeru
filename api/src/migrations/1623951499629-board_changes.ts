import {MigrationInterface, QueryRunner} from "typeorm";

export class boardChanges1623951499629 implements MigrationInterface {
    name = 'boardChanges1623951499629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "update_at"`);
        await queryRunner.query(`ALTER TABLE "board" ADD "data" jsonb DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "board" ADD "is_public" boolean`);
        await queryRunner.query(`ALTER TABLE "board" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "board" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "FK_c9951f13af7909d37c0e2aec484" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "FK_c9951f13af7909d37c0e2aec484"`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "is_public"`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "board" ADD "update_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
