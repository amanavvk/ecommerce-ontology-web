// This file exports TypeScript types and interfaces used across the application for type safety.

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    inventoryCount: number;
}

export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}

export interface Order {
    id: string;
    userId: string;
    productIds: string[];
    totalAmount: number;
    orderDate: string;
}

export interface QueryResult {
    [key: string]: any;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface OntologyClass {
    name: string;
    properties: string[];
}

export interface OntologyRelationship {
    source: string;
    target: string;
    type: string;
}