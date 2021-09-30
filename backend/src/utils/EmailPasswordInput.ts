import { Field, InputType } from 'type-graphql';

// for arguments
@InputType()
export class EmailPasswordInput {
  @Field()
  email: string;
  @Field()
  password: string;
}
