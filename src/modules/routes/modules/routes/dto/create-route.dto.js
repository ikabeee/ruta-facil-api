"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRouteDto = void 0;
const class_validator_1 = require("class-validator");
class CreateRouteDto {
}
exports.CreateRouteDto = CreateRouteDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es obligatorio.' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El nombre no puede exceder los 100 caracteres.' }),
    __metadata("design:type", String)
], CreateRouteDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La imagen debe ser una cadena de texto.' }),
    (0, class_validator_1.MaxLength)(255, { message: 'La URL de la imagen no puede exceder los 255 caracteres.' }),
    __metadata("design:type", String)
], CreateRouteDto.prototype, "img", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'El punto inicial debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El punto inicial es obligatorio.' }),
    (0, class_validator_1.MaxLength)(200, { message: 'El punto inicial no puede exceder los 200 caracteres.' }),
    __metadata("design:type", String)
], CreateRouteDto.prototype, "firstPoint", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'El punto final debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El punto final es obligatorio.' }),
    (0, class_validator_1.MaxLength)(200, { message: 'El punto final no puede exceder los 200 caracteres.' }),
    __metadata("design:type", String)
], CreateRouteDto.prototype, "lastPoint", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser una cadena de texto.' }),
    (0, class_validator_1.MaxLength)(500, { message: 'La descripción no puede exceder los 500 caracteres.' }),
    __metadata("design:type", String)
], CreateRouteDto.prototype, "description", void 0);
