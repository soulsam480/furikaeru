import {MigrationInterface, QueryRunner} from "typeorm";

export class boardMaxVote1627401159066 implements MigrationInterface {
    name = 'boardMaxVote1627401159066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" ADD "max_vote" integer DEFAULT '5'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "max_vote"`);
    }

}
