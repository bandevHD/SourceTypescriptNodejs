require('reflect-metadata');
import { Repository } from 'typeorm';
import { myDataSource } from '../../config/conenctTypeORM';
import { PaginationType } from '../../utils/types';

interface ObjectLiteral {
  [key: string]: any;
}
export class BaseService<Model extends ObjectLiteral> {
  target;
  constructor(model: Model) {
    this.target = model;
    this.reposity = myDataSource.getRepository(this.target);
  }
  private readonly reposity: Repository<Model>;

  createService = async (data) => {
    const newData = await this.reposity.create(data);
    const saveData = await this.reposity.save(newData);
    return { statusCode: 200, data: saveData };
  };

  readListService = async (paginationType: PaginationType) => {
    const [result, count] = await this.reposity
      .createQueryBuilder('vouchers')
      .orderBy({ created_at: 'DESC' })
      .skip(paginationType.skip)
      .take(paginationType.take)
      .getManyAndCount();
    return {
      statusCode: 200,
      data: {
        count,
        result,
      },
    };
  };

  readOneService = async (data) => {
    const findOneData = await this.reposity.findOneBy(data);
    return {
      statusCode: 200,
      data: findOneData,
    };
  };

  updatePutService = async (id, data) => {
    return await this.reposity
      .update(id, data)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Update successfully!',
          data: id,
        };
      })
      .catch(() => {
        return {
          statusCode: 500,
          message: 'Update fail!',
        };
      });
  };

  deleteService = async (id, data) => {
    await this.reposity.softDelete(id);
    return {
      statusCode: 200,
      data: id,
    };
  };
}
