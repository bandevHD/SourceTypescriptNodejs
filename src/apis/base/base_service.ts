require('reflect-metadata');
import { Repository } from 'typeorm';
import { myDataSource } from '../../config/conenctTypeORM';

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

  createService = async (data: any) => {
    const newData = this.reposity.create(data);
    const saveData = await this.reposity.save(newData);
    return { statusCode: 200, data: saveData };
  };

  readListService = async () => {
    const [result, count] = await this.reposity.findAndCount();
    return {
      statusCode: 200,
      data: {
        count,
        result,
      },
    };
  };

  readOneService = async (data: any) => {
    const findOneData = await this.reposity.findOneBy(data);
    return {
      statusCode: 200,
      data: findOneData,
    };
  };

  updatePutService = async (id: any, data: any) => {
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

  deleteService = async (id: any, data: any) => {
    await this.reposity.update(id, data);
    return {
      statusCode: 200,
      data: id,
    };
  };
}
