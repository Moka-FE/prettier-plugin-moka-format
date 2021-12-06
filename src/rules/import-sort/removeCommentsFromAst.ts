import { CommentBlock, CommentLine, File } from '@babel/types';
import { isEqual } from 'lodash';

export const removeCommentsFromAst = (ast: File, comments: Array<CommentBlock | CommentLine>) => {
  ast.comments = ast.comments?.filter((astComment) => {
    return !comments.find((comment) => isEqual(comment, astComment));
  });
};
