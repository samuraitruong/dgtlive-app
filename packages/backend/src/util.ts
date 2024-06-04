import * as crypto from 'crypto'

export function hashObject(o: any) {
    return crypto.createHash('sha1').update(JSON.stringify(o)).digest('hex')
}