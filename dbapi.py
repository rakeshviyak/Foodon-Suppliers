import endpoints

from google.appengine.ext import ndb
from protorpc import remote

from endpoints_proto_datastore.ndb import EndpointsModel, EndpointsDateProperty

import logging

WEB_CLIENT_ID = '935842685891-akaa53kqu9v86pcnh5kn4j41kaltnd18.apps.googleusercontent.com'
ANDROID_CLIENT_ID = 'replace this with your Android client ID'
IOS_CLIENT_ID = 'replace this with your iOS client ID'
ANDROID_AUDIENCE = WEB_CLIENT_ID


class MyModel(EndpointsModel):
    _message_fields_schema = (
        'id', 'productname', 'category', 'offerprice', 'usualprice', 'doe', 'owner')
    productname = ndb.StringProperty()
    category = ndb.StringProperty()
    offerprice = ndb.FloatProperty()
    usualprice = ndb.FloatProperty()
    doe = EndpointsDateProperty()
    # productimg = ndb.BlobProperty()
    owner = ndb.UserProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    modified = ndb.DateTimeProperty(auto_now=True)


# Use of this decorator is the same for APIs created with or without
# endpoints-proto-datastore.
@endpoints.api(allowed_client_ids=[WEB_CLIENT_ID, ANDROID_CLIENT_ID,
                                   IOS_CLIENT_ID, endpoints.API_EXPLORER_CLIENT_ID],
               audiences=[ANDROID_AUDIENCE],
               scopes=[endpoints.EMAIL_SCOPE],
               name='myapi', version='v1', description='My Little API')
class MyApi(remote.Service):

    @MyModel.method(path='mymodel', http_method='POST',
                    name='mymodel.insert')
    def MyModelInsert(self, my_model):
        logging.info(endpoints.get_current_user())
        my_model.owner = endpoints.get_current_user()
        my_model.put()
        return my_model

    @MyModel.query_method(query_fields=('limit', 'order', 'pageToken'),
                          path='mymodels',
                          name='mymodel.list')
    def MyModelList(self, query):
        # return query.filter(MyModel.owner == endpoints.get_current_user())
        return query

    @MyModel.method(request_fields=('id',),
                    path='mymodel/{id}', http_method='GET', name='mymodel.getByID')
    def MyModelGetById(self, my_model):
        if not my_model.from_datastore:
            raise endpoints.NotFoundException('MyModel not found.')
        return my_model


# Use of endpoints.api_server is the same for APIs created with or without
# endpoints-proto-datastore.
APPLICATION = endpoints.api_server([MyApi], restricted=False)