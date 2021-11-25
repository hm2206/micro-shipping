import { StorageModule } from '@haorama/nestjs-storage';
import * as path from 'path';

export const StorageConfig = StorageModule.forRootAsync({
  useFactory: () => ({
    config: {
      default: 'local',
      disks: {
        local: {
          driver: 'local',
          config: {
            root: path.resolve(__dirname, `../../../upload`)
          }
        }
      }
    }
  })
})