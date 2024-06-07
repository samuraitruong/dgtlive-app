import { Inject, Injectable } from '@nestjs/common';
import { createDynamicGatewayClass } from './dynamic.gateway';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ModuleRef } from '@nestjs/core';
//import { Server } from 'socket.io';

@Injectable()
export class GatewayManagerService {
    private gateways: Map<string, any> = new Map();
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly moduleRef: ModuleRef) {

    }
    async createGateway(path: string): Promise<any> {
        if (this.gateways.has(path)) {
            return this.gateways.get(path);
        }

        //const gateway = new DynamicGateway(this.cacheManager, { path });
        const dynamicModule = createDynamicGatewayClass(path, {});
        const module = await this.moduleRef.create(dynamicModule.module);
        console.log("start new gateway", path, module)
        const gateway = module.get(dynamicModule.providers[0] as any);
        this.gateways.set(path, gateway);
        return gateway;
    }

    getGateway(namespace: string): any {
        return this.gateways.get(namespace);
    }

    removeGateway(namespace: string): void {
        if (this.gateways.has(namespace)) {
            this.gateways.delete(namespace);
        }
    }

    bootstrap() {
        const initialNamespaces = ['test']
        console.log("Bootstrap all gateway")

        for (const namespace of initialNamespaces) {
            this.createGateway(namespace);
        }

    }
}