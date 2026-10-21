import { UserRole, ValidationStatus, RiskClass, HazardClass, LayerType } from '../constants';
import { GeoJsonGeometry } from '../schemas/geojson';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserEntity extends BaseEntity {
  name: string;
  phoneHash: string;
  role: UserRole;
  rt: string | null;
  rw: string | null;
  status: string;
  consentAt: string | null;
}

export interface LayerEntity extends BaseEntity {
  slug: string;
  title: string;
  type: LayerType;
  geometryType: string;
  source: string;
  version: string;
  published: boolean;
  styleJson: Record<string, unknown> | null;
}

export interface WaterSourceEntity extends BaseEntity {
  name: string;
  type: string;
  condition: string;
  status: string;
  usage: string;
  debit: number | null;
  accessNotes: string | null;
  geom: GeoJsonGeometry;
}

export interface ParticipatoryFeatureEntity extends BaseEntity {
  userId: string;
  category: string;
  description: string;
  geom: GeoJsonGeometry;
  photoIds: string[];
  validationStatus: ValidationStatus;
  validatedBy: string | null;
  validatedAt: string | null;
  rejectReason: string | null;
  hazardClass: HazardClass | null;
}

export interface ReportEntity extends BaseEntity {
  userId: string;
  category: string;
  description: string;
  geom: GeoJsonGeometry;
  accuracyMeters: number;
  validationStatus: ValidationStatus;
}
