import { Document, FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { BadRequestError } from "../utils/errors/app.error";

abstract class BaseRepository<T extends Document> {
    constructor(private readonly model: Model<T>) { }

    async create(data: Partial<T>): Promise<T> {
        const record = await this.model.create(data);
        return await record.save();
    }

    async findAll(): Promise<T[]> {
        return await this.model.find();
    }

    async findById(id: string | Types.ObjectId): Promise<T | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Invalid ID format");
        }

        return await this.model.findById(id);
    }

    async update(id: string | Types.ObjectId, updateData: UpdateQuery<T>): Promise<T | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Invalid ID format");
        }

        return await this.model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async delete(id: string): Promise<T | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Invalid ID format");
        }

        return await this.model.findByIdAndDelete(id);
    }

    async count(filter: FilterQuery<T> = {}): Promise<number> {
        return await this.model.countDocuments(filter);
    }

    async exists(filter: FilterQuery<T> = {}): Promise<boolean> {
        return await this.model.exists(filter) !== null;
    }
}

export default BaseRepository;