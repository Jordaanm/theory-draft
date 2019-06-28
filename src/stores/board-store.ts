import { observable, autorun } from 'mobx';

export class BoardStore {    
    @observable
    units: any[] = [];
}