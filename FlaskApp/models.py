from peewee import *
import peewee
import config as c

database = MySQLDatabase(c.BLOG_DB, **c.DB_KWARGS)

class BaseModel(Model):
    class Meta:
        database = database

class Post(BaseModel):
    text = TextField()
    external = TextField()
    date = DateField()
    title = CharField()
    live = IntegerField()

    class Meta:
        order_by = ('date',)

    @classmethod
    def create_or_update(cls, post_attrs, tags):
        try:
            post = cls.create(**post_attrs)
        except peewee.IntegrityError:
            post_attrs['id'] = cls.get(date=post_attrs['date']).id
            post = Post(**post_attrs)
            post.save()
        Tagging.delete().where(Tagging.post == post).execute()
        for tag_name in tags:
            try:
                tag = Tag.get(Tag.name == tag_name)
            except peewee.DoesNotExist:
                tag = Tag.create(name = tag_name)
            try:
                Tagging.create(post=post, tag=tag)
            except peewee.IntegrityError:
                pass
        return post

    def tags(self):
        return Tag.select().join(Tagging).join(Post).where(Post.id == self)

class Tag(BaseModel):
    name = CharField()
    
    def posts(self, include_text=True):
        if include_text:
            cols = Post.select()
        else:
            cols = Post.select(Post.date, Post.title, Post.live)
        return cols.join(Tagging).join(Tag).where(Tag.id == self).where(Post.live == True)

class Tagging(BaseModel):
    post = ForeignKeyField(Post)
    tag = ForeignKeyField(Tag)

if __name__ == "__main__":
    python_tag = Tag.select().where(Tag.name=="python")[0]
    posts = python_tag.posts()
    for post in posts:
        print post.text

    post = Post.select()[0]
    tags = post.tags()
    print post.text
    for tag in tags:
        print tag.name


