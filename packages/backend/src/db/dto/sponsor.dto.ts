// create-sponsor.dto.ts
export class CreateSponsorDto {
  readonly name: string;
  readonly logoUrl?: string;
  readonly description?: string;
  readonly tournaments?: string[];
}

// update-sponsor.dto.ts
export class UpdateSponsorDto {
  readonly name?: string;
  readonly logoUrl?: string;
  readonly description?: string;
  readonly tournaments?: string[];
}
