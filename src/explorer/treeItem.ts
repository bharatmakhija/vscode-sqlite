import { TreeItem, TreeItemCollapsibleState, Command } from "vscode";
import { join, basename } from "path";

export interface SQLTree {
    [dbPath: string]: DatabaseItem;
}

export class SQLItem extends TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public readonly command?: Command
    ) {
        super(label, collapsibleState);
    }
}

export class DatabaseItem extends SQLItem {
    
    constructor(public name: string, command?: Command) {
        super(
            basename(name),
            TreeItemCollapsibleState.Collapsed,
            command
        );

        this.iconPath = {
            light: join(__filename, '..', '..', '..', 'resources', 'light', 'database.svg'),
            dark: join(__filename, '..', '..', '..', 'resources', 'dark', 'database.svg')
        };

        this.contextValue = 'sqlite.databaseItem';
    }

    get tooltip(): string {
        return `${this.name}`;
    }
}

export class TableItem extends SQLItem {

    constructor(private name: string, private type: string, command?: Command) {
        super(
            name,
            TreeItemCollapsibleState.Collapsed,
            command
        );
        this.contextValue = 'sqlite.tableItem';
        
        let icon_name = "table.svg";
        if (this.type === "view") {
            icon_name = "table_view.svg";
        }
        this.iconPath = {
            light: join(__filename, '..', '..', '..', 'resources', 'light', icon_name),
            dark: join(__filename, '..', '..', '..', 'resources', 'dark', icon_name)
        };
    }

    get tooltip(): string {
        //var dbName = basename(dirname(this.id));
        //var dbNameNoExtension = dbName.substr(0, dbName.lastIndexOf('.')) || dbName;
        return `${this.name}\n${this.type === "view"? "VIEW" : "TABLE"}`;
    }
}

export class ColumnItem extends SQLItem {

    constructor(private name:string, private type: string,
            private notnull: boolean, private pk: number, private defVal: string, command?: Command) {
        super(
            name+` : ${type.toLowerCase()}`,
            TreeItemCollapsibleState.None,
            command
        );
        
        this.contextValue = 'sqlite.columnItem';

        let iconName = notnull? 'col_notnull.svg' : 'col_nullable.svg';
        iconName = pk > 0? 'col_pk.svg' : iconName;

        this.iconPath = {
            light: join(__filename, '..', '..', '..', 'resources', 'light', iconName),
            dark: join(__filename, '..', '..', '..', 'resources', 'dark', iconName)
        };
    }

    get tooltip(): string {
        let pkTooltip = this.pk? '\nPRIMARY KEY' : '';
        let notnullTooltip = this.notnull? '\nNOT NULL' : '';
        let defvalTooltip = this.defVal !== 'NULL'? `\nDEFAULT: ${this.defVal}` : '';
        return `${this.name}\n${this.type}${pkTooltip}${notnullTooltip}${defvalTooltip}`;
    }

}