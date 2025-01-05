import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { RolesPermissionsService } from '../roles-permissions/roles-permissions.service';

const mockDocumentService = {};
const mockRolesPermissionsService = {};

describe('DocumentController', () => {
    let controller: DocumentController;
    let service: DocumentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DocumentController],
            providers: [
                {
                    provide: RolesPermissionsService,
                    useValue: mockRolesPermissionsService,
                },
                {
                    provide: DocumentService,
                    useValue: mockDocumentService,
                }
            ]
        }).compile();

        controller = module.get<DocumentController>(DocumentController);
        service = module.get<DocumentService>(DocumentService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
