import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsObject, IsOptional, IsString, IsUUID, Min, ValidateNested } from "class-validator";
import { CreateProductoAlmacenDto } from "./create-producto-almacen.dto";
import { MetodoReabasto, UnidadCompra, UnidadVenta } from "../entities/producto.entity";

class Provedor {

	@IsUUID("4",{message:"El id del provedor tiene que ser un uuid valido!"})
	provedor:string;
	
	@IsInt()
	@Min(0)
	@Transform(({value}) => parseInt(value))
	costo:number;

};

export class CreateProductoDto {

	@IsOptional()
	@IsString()
	SKU:string;	

	@IsString({message:"El nombre del producto debe ser un string"})
	nombre:string;

	@IsString()
	descripcion:string;

	@IsInt()
	@Min(1)
	@Transform(({value}) => parseInt(value))
	stock_minimo:number;

	// @IsOptional()
	// @IsInt()
	// @Min(1)
	// @Transform(({value}) => parseInt(value))
	// costo_promedio:number;

	@IsOptional()
    @IsUUID("4",{message:"La categoria debe ser un UUID valido!"})
    categoria:string;

    @IsUUID("4",{message:"La unidad de medida del SAT debe ser un UUID valido!"})
	unidadMedidaSat:string;

    @IsUUID("4",{message:"La clave del sat ser un UUID valido!"})
	claveSat:string;

	@IsOptional()
    @IsUUID("4",{message:"La marca del producto debe ser un UUID valido!"})
	marca:string;

	@IsOptional()
	@IsArray({message:"Los provedores deben ser un array de provedores"})
	@Type(() => Provedor)
	@ValidateNested({each:true})
	provedores:Provedor[];

	@IsOptional()
	@IsArray()
	@ValidateNested({each:true})
	@Type(() => CreateProductoAlmacenDto)
	almacenes:CreateProductoAlmacenDto[];

	@IsOptional()
	@IsString()
	material:string;

	@IsOptional()
	@IsString()
	color:string;

	@IsOptional()
	@IsBoolean()
	inventariable:boolean;


	@IsEnum(UnidadCompra,{message:"La unida de compra no es valida!"})
	unidad_compra:UnidadCompra;

	@IsEnum(UnidadVenta,{message:"La unidad de venta no es valida!"})
	unidad_venta:UnidadVenta;

	@IsEnum(MetodoReabasto,{message:"La unidad de reabasto no es valida!"})
	metodo_reabasto:MetodoReabasto;

	@IsOptional()
    @IsObject()
    detalles: Record<string, any>;

	@IsOptional()
	@IsNumber()
	dias_reabasto:number;

	@IsOptional()
	@IsBoolean()
	es_producto_padre:boolean;

	@IsOptional()
	@IsBoolean()
	es_producto_hijo:boolean;

	@IsOptional()
	@IsUUID("4",{message:"El id del poroducto padre debe ser un id valido!"})
	producto_padre:string;

	@IsOptional()
	@IsNumber()
	numero_productos_hijos:number;
};

