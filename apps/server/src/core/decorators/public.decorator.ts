import { SetMetadata } from '@nestjs/common';
import { METADATA_PUBLIC_KEY } from '../constants';

export const Public = () => SetMetadata(METADATA_PUBLIC_KEY, true);
