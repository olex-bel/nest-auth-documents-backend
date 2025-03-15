import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent } from "typeorm";
import Folder from "src/entities/folder.entity";

@EventSubscriber()
export class FoldersSubscriber implements EntitySubscriberInterface<Folder> {
    listenTo() {
        return Folder
    }

    async afterInsert(event: InsertEvent<Folder>) {
        await this.updateSearchVector(event)
    }

    async afterUpdate(event: UpdateEvent<Folder>) {
        await this.updateSearchVector(event)
    }

    private async updateSearchVector(event: UpdateEvent<Folder> | InsertEvent<Folder>) {
        if (!event.entity) {
            return;
        }

        await event.manager.query(
            `
              UPDATE folders
              SET "name_full_text_search" = to_tsvector(coalesce(name,''))
              WHERE AND id = $1;
              `,
            [event.entity.id],
        );
    }
}

