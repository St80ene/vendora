import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/users/enums/user-role.enum';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Call AuthGuard to ensure the user is authenticated
    const baseGuardResult = await super.canActivate(context);
    if (!baseGuardResult) {
      // If authentication fails, deny access
      return false;
    }

    // Retrieve the roles required for the route
    const requireRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requireRoles) {
      return true;
    }

    // Get the user from the request (already injected by the AuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Check if the user's roles (from DB) match the required roles
    return requireRoles.some((role) => user.roles?.includes(role));
  }
}
