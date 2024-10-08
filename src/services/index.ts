import { BaseCommandService } from "./baseCommandService";
import { ScanService } from "./scanService";
import { DependencyService } from "./dependencyService";
import { AuthService } from "./authService";
import { PolicyRuleService } from "./policyRuleService";

const authService = new AuthService();
const dependencyService = new DependencyService();
const baseCommandService = new BaseCommandService();
const policyRuleService = new PolicyRuleService();
const scanService = new ScanService(policyRuleService, dependencyService);

export { baseCommandService, scanService, dependencyService, authService, policyRuleService };
