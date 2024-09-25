import { BaseCommandService } from "./baseCommandService";
import { FileService } from "./fileService";
import { ScanService } from "./scanService";
import { DependencyService } from "./dependencyService";
import { AuthService } from "./authService";

const authService = new AuthService();
const fileService = new FileService();
const dependencyService = new DependencyService();
const baseCommandService = new BaseCommandService();
const scanService = new ScanService();

export { baseCommandService, scanService, fileService, dependencyService, authService };
