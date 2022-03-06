import { IsArray, IsOptional, IsString } from 'class-validator';

export type BlockToolData<T extends Record<string, any>> = T;
export interface OutputBlockData<
  Type extends string = string,
  Data extends Record<string, any> = any,
> {
  id?: string;
  type: Type;
  data: BlockToolData<Data>;
}

export class CreatePostDto {
  @IsString()
  title: string;

  @IsArray()
  body: OutputBlockData[];

  @IsOptional()
  @IsArray()
  tags: string;
}
