import { BadRequestException, InternalServerErrorException } from "@nestjs/common";

export const handleDBErrors = (error:any):never => { //-> never jamas regresara algo
    if(error.code === "23505") throw new BadRequestException(error.detail);
    throw new InternalServerErrorException("Please check server logs...");
}