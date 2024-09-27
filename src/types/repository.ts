export interface Repository {
    name: RepositoryName;
    repositoryId: number;
    useCase: UseCase;
    automations: {
        amount: number;
        link: string;
    };
    integration: string;
    scanningEnabled: {
        value: null | boolean; // or any other suitable type
        id: number;
    };
    removeRepository: {
        id: number;
        name: string;
        link: string;
    };
}

interface RepositoryName {
    name: string;
    repoId: number;
    showEditIcon: boolean;
    link: string;
    isEditable: boolean;
}

interface UseCase {
    value: number;
    repoId: number;
    label: string;
    tooltip: string;
}
