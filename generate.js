// generate.js
const fs = require("fs");
const path = require("path");

const entityName = process.argv[2];

if (!entityName) {
  console.error(
    "Please provide an entity name. Example: npm run generate users"
  );
  process.exit(1);
}

const baseDir = path.join(__dirname, "src");

// Function to create file content
const createFileContent = (name, content) => {
  const fileName = path.join(baseDir, name);
  fs.writeFileSync(fileName, content);
  console.log(`File ${fileName} created successfully!`);
};

// Function to create folders if they don't exist
const createFolders = (folders) => {
  folders.forEach((folder) => {
    const folderPath = path.join(baseDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  });
};

// Function to convert to PascalCase
const toPascalCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Create files in the desired folders
const createController = () => `
import { Request, Response } from 'express';
import * as ${toPascalCase(
  entityName
)}Service from '../services/${entityName}.service';

export const create${toPascalCase(
  entityName
)}Controller = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await ${toPascalCase(
      entityName
    )}Service.create${toPascalCase(entityName)}Service(data);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating ${entityName}:', error);
    res.status(error.status || 500).send(error.message || 'Internal server error');
  }
};

export const getAll${toPascalCase(
  entityName
)}Controller = async (req: Request, res: Response) => {
  try {
    const result = await ${toPascalCase(
      entityName
    )}Service.getAll${toPascalCase(entityName)}Service();
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error fetching ${entityName}s:', error);
    res.status(500).send('Internal server error');
  }
};

export const getById${toPascalCase(
  entityName
)}Controller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await ${toPascalCase(
      entityName
    )}Service.getById${toPascalCase(entityName)}Service(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).send('Record not found');
    }
  } catch (error: any) {
    console.error('Error fetching ${entityName} by ID:', error);
    res.status(500).send('Internal server error');
  }
};

export const update${toPascalCase(
  entityName
)}Controller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;
    const result = await ${toPascalCase(
      entityName
    )}Service.update${toPascalCase(entityName)}Service(id, data);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).send('Record not found');
    }
  } catch (error: any) {
    console.error('Error updating ${entityName}:', error);
    res.status(error.status || 500).send(error.message || 'Internal server error');
  }
};

export const remove${toPascalCase(
  entityName
)}Controller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await ${toPascalCase(
      entityName
    )}Service.remove${toPascalCase(entityName)}Service(id);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).send('Record not found');
    }
  } catch (error: any) {
    console.error('Error deleting ${entityName}:', error);
    res.status(error.status || 500).send(error.message || 'Internal server error');
  }
};
`;

const createEntity = () => `
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('${entityName.toLowerCase()}')
export class ${toPascalCase(entityName)} {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  example: string;
}
`;

const createInterface = () => `
export interface Create${toPascalCase(entityName)}Dto {
  example: string;
}
`;

// Use a UNIX timestamp to generate the migration file name
const timestamp = new Date().getTime();
const migrationFileName = `${timestamp}-Create${toPascalCase(
  entityName
)}Table.ts`;

const createMigration = () => `
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Create${toPascalCase(
  entityName
)}Table${timestamp} implements MigrationInterface {
  name = 'Create${toPascalCase(entityName)}Table${timestamp}';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: '${entityName.toLowerCase()}',
      columns: [
        { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
        { name: 'example', type: 'varchar' },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('${entityName.toLowerCase()}');
  }
}
`;

const createRoute = () => `
import { Router } from 'express';
import * as ${entityName}Controller from '../controllers/${entityName}.controller';

const router = Router();

router.post('/', ${entityName}Controller.create${toPascalCase(
  entityName
)}Controller);
router.get('/', ${entityName}Controller.getAll${toPascalCase(
  entityName
)}Controller);
router.get('/:id', ${entityName}Controller.getById${toPascalCase(
  entityName
)}Controller);
router.patch('/:id', ${entityName}Controller.update${toPascalCase(
  entityName
)}Controller);
router.delete('/:id', ${entityName}Controller.remove${toPascalCase(
  entityName
)}Controller);

export default router;
`;

const createService = () => `
import { AppDataSource } from '../data-source';
import { ${toPascalCase(entityName)} } from '../entities/${entityName}';
import { Create${toPascalCase(
  entityName
)}Dto } from '../interfaces/${entityName}.interface';

export const create${toPascalCase(
  entityName
)}Service = async (data: Create${toPascalCase(
  entityName
)}Dto): Promise<${toPascalCase(entityName)}> => {
  const ${entityName.toLowerCase()}Repository = AppDataSource.getRepository(${toPascalCase(
  entityName
)});

  // Verify if the data is present and has the expected format
  if (!data || typeof data.example !== 'string') {
    throw { status: 400, message: 'Bad Request: Invalid data. Make sure to provide an object with the "example" property of type string.' };
  }

  const new${toPascalCase(
    entityName
  )} = ${entityName.toLowerCase()}Repository.create(data);

  try {
    return await ${entityName.toLowerCase()}Repository.save(new${toPascalCase(
  entityName
)});
  } catch (error) {
    console.error('Error saving ${entityName}:', error);
    throw { status: 500, message: 'Internal error while saving the entity.' };
  }
};

export const getAll${toPascalCase(
  entityName
)}Service = async (): Promise<${toPascalCase(entityName)}[]> => {
  const ${entityName.toLowerCase()}Repository = AppDataSource.getRepository(${toPascalCase(
  entityName
)});
  return await ${entityName.toLowerCase()}Repository.find();
};

export const getById${toPascalCase(
  entityName
)}Service = async (id: number): Promise<${toPascalCase(
  entityName
)} | undefined> => {
  const ${entityName.toLowerCase()}Repository = AppDataSource.getRepository(${toPascalCase(
  entityName
)});
  const ${entityName.toLowerCase()} = await ${entityName.toLowerCase()}Repository.findOne({ where: { id: id } });
  if (${entityName.toLowerCase()}) {
    return ${entityName.toLowerCase()};
  } else {
    return undefined;
  }
};

export const update${toPascalCase(
  entityName
)}Service = async (id: number, data: Create${toPascalCase(
  entityName
)}Dto): Promise<${toPascalCase(entityName)} | undefined> => {
  const ${entityName.toLowerCase()}Repository = AppDataSource.getRepository(${toPascalCase(
  entityName
)});
  const existing${toPascalCase(
    entityName
  )} = await ${entityName.toLowerCase()}Repository.findOne({ where: { id: id } });

  if (existing${toPascalCase(entityName)}) {
    ${entityName.toLowerCase()}Repository.merge(existing${toPascalCase(
  entityName
)}, data);
    return await ${entityName.toLowerCase()}Repository.save(existing${toPascalCase(
  entityName
)});
  } else {
    return undefined;
  }
};

export const remove${toPascalCase(
  entityName
)}Service = async (id: number): Promise<boolean> => {
  const ${entityName.toLowerCase()}Repository = AppDataSource.getRepository(${toPascalCase(
  entityName
)});
  const result = await ${entityName.toLowerCase()}Repository.delete(id);
  return result.affected === 1;
};
`;

// Ensure to create the folders if they don't exist
createFolders([
  "controllers",
  "entities",
  "interfaces",
  "migrations",
  "routes",
  "services",
]);

// Create the files
createFileContent(
  `controllers/${entityName}.controller.ts`,
  createController()
);
createFileContent(`entities/${entityName}.ts`, createEntity());
createFileContent(`interfaces/${entityName}.interface.ts`, createInterface());
createFileContent(`migrations/${migrationFileName}`, createMigration());
createFileContent(`routes/${entityName}.routes.ts`, createRoute());
createFileContent(`services/${entityName}.service.ts`, createService());

console.log("Files generated successfully!");
