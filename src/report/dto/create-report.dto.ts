import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReportDto {
    
    @IsIn(['article', 'comment'])
    @IsString()
    type: string;

    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    reportContent: string;
}
