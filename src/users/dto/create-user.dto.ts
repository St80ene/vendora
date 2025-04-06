import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  IsUUID,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { MatchPasswords } from 'src/common/match.decorator'; // Custom decorator for matching fields

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 500)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100) // Ensures minimum length of 8
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    }
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  @MatchPasswords('password', { message: 'Passwords do not match' }) // Ensures confirmPassword matches password
  confirm_password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole; // Optional, backend can set a default

  @IsOptional()
  @IsString()
  @Length(0, 500)
  avatar_url?: string; // Optional avatar URL

  @IsOptional()
  @IsString()
  avatar_public_id?: string; // Optional avatar public ID
}
