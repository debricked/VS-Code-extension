import { BaseCommandService } from "./baseCommand.service";
import { ScanService } from "./scan.service";
import { DependencyService } from "./dependency.service";
import { AuthService } from "./auth.service";
import { PolicyRuleService } from "./policyRule.service";

const authService = new AuthService();
const dependencyService = new DependencyService();
const baseCommandService = new BaseCommandService();
const policyRuleService = new PolicyRuleService();
const scanService = new ScanService(policyRuleService, dependencyService);

export { baseCommandService, scanService, dependencyService, authService, policyRuleService };
