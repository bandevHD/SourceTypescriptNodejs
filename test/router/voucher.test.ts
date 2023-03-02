import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from '../../server';
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createVoucherTest } from '../../src/apis/core_v1/voucher/services';
import {
  createVoucher,
  deleteVoucherBodyNotFound,
  updateVoucherBodyNotFound,
  updateVoucherBodySuccess,
} from '../mock/body';
import { productId } from '../mock/params';

const app = createServer();
dotenv.config();
mongoose.set('strictQuery', true);
beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});
describe('voucher', () => {
  describe('get create voucher', () => {
    it('create voucher success 200', async () => {
      const { statusCode } = await supertest(app)
        .post(`/api-v1/voucher/createVoucher`)
        .send(createVoucher);
      expect(statusCode).toBe(200);
    });
  });
  describe('get one voucher', () => {
    it('find not item in database return 404', async () => {
      await supertest(app).get(`/api-v1/voucher/getOneVoucher/${productId}`).expect(404);
    });
    it('return object voucher', async () => {
      const voucher = await createVoucherTest(createVoucher);
      const { statusCode, body } = await supertest(app).get(
        `/api-v1/voucher/getOneVoucher/${voucher._id.toString()}`,
      );
      expect(statusCode).toBe(200);

      expect(body.data._id).toBe(voucher._id.toString());
    });
  });
  describe('update voucher', () => {
    it('get voucher to update not found return 404', async () => {
      const { statusCode } = await supertest(app)
        .put(`/api-v1/voucher/updateVoucher`)
        .send(updateVoucherBodyNotFound);

      expect(statusCode).toBe(404);
    });

    it('update voucher success send 200', async () => {
      const voucher = await createVoucherTest(createVoucher);
      const { statusCode } = await supertest(app)
        .put(`/api-v1/voucher/updateVoucher`)
        .send(updateVoucherBodySuccess(voucher));
      expect(statusCode).toBe(200);
    });
  });
  describe('update patch voucher', () => {
    it('get voucher to update not found return 404', async () => {
      const { statusCode } = await supertest(app)
        .patch(`/api-v1/voucher/updateVoucher`)
        .send(updateVoucherBodyNotFound);

      expect(statusCode).toBe(404);
    });

    it.skip('update patch voucher send 200', async () => {
      const voucher = await createVoucherTest(createVoucher);
      const { statusCode } = await supertest(app)
        .patch(`/api-v1/voucher/updateVoucher`)
        .send(voucher);
      expect(statusCode).toBe(200);
    });
  });

  describe('delete voucher', () => {
    it('get voucher to delete not found return 404', async () => {
      const { statusCode } = await supertest(app)
        .delete(`/api-v1/voucher/deleteVoucher`)
        .send(deleteVoucherBodyNotFound);

      expect(statusCode).toBe(404);
    });

    it('delete voucher success send 200', async () => {
      const voucher = await createVoucherTest(createVoucher);
      const { statusCode } = await supertest(app)
        .delete(`/api-v1/voucher/deleteVoucher`)
        .send({ _id: voucher._id });
      expect(statusCode).toBe(200);
    });
  });
});
